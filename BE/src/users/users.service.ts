import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto, UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: UserDocument[];
    pagination: { page: number; limit: number; total: number };
  }> {
    const skip = (page - 1) * limit;
    const users = await this.userModel
      .find({ isActive: true })
      .select('-password -emailVerificationToken -passwordResetToken')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.userModel.countDocuments({ isActive: true });

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findById(id)
      .select('-password -emailVerificationToken -passwordResetToken');
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email })
      .select('+password +emailVerificationToken +passwordResetToken');
  }

  async findByEmailVerificationToken(
    token: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ emailVerificationToken: token });
  }

  async findByPasswordResetToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ passwordResetToken: token });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being changed and if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserDto.email,
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return user.save();
  }

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if phone is being changed and if it already exists
    if (updateProfileDto.phone && updateProfileDto.phone !== user.phone) {
      const existingUser = await this.userModel.findOne({
        phone: updateProfileDto.phone,
      });
      if (existingUser) {
        throw new ConflictException(
          'Số điện thoại đã được sử dụng bởi user khác',
        );
      }
    }

    // Merge preferences if provided
    if (updateProfileDto.preferences) {
      user.preferences = {
        ...user.preferences,
        ...updateProfileDto.preferences,
      };
      if (updateProfileDto.preferences.notifications) {
        user.preferences.notifications = {
          ...user.preferences.notifications,
          ...updateProfileDto.preferences.notifications,
        };
      }
    }

    // Update other fields
    if (updateProfileDto.fullName) {
      user.fullName = updateProfileDto.fullName;
    }
    if (updateProfileDto.phone) {
      user.phone = updateProfileDto.phone;
    }

    return user.save();
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { password: hashedPassword });
  }

  async updatePasswordResetToken(
    id: string,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });
  }

  async clearPasswordResetToken(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { lastLoginAt: new Date() });
  }

  async verifyEmail(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      isEmailVerified: true,
      emailVerificationToken: undefined,
    });
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userModel.findById(id).select('+password');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác');
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.password,
    );
    if (isSamePassword) {
      throw new BadRequestException(
        'Mật khẩu mới phải khác với mật khẩu hiện tại',
      );
    }

    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      12,
    );
    await this.userModel.findByIdAndUpdate(id, { password: hashedNewPassword });
  }

  async updateAvatar(
    id: string,
    avatarUrl: string,
    avatarThumbnailUrl?: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.avatar = avatarUrl;
    if (avatarThumbnailUrl) {
      user.avatarThumbnail = avatarThumbnailUrl;
    }

    return user.save();
  }

  async removeAvatar(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.avatar = undefined;
    user.avatarThumbnail = undefined;

    return user.save();
  }

  async getUserGroups(
    id: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
    role?: string,
  ) {
    // This will be implemented when Group module is ready
    // For now, return empty result
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  async getUserNotifications(
    id: string,
    page: number = 1,
    limit: number = 20,
    type?: string,
    isRead?: boolean,
  ) {
    // This will be implemented when Notification module is ready
    // For now, return empty result
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      unreadCount: 0,
    };
  }

  async remove(id: string): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete
    await this.userModel.findByIdAndUpdate(id, { isActive: false });
  }

  async getProfile(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findById(id)
      .select('-password -emailVerificationToken -passwordResetToken');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
