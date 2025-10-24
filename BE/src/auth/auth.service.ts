import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });

    // Update last login
    await this.usersService.updateLastLogin(user._id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        phone: user.phone,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      this.configService.get<number>('app.bcryptRounds'),
    );

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      emailVerificationToken: uuidv4(),
    });

    // TODO: Send verification email
    // await this.sendVerificationEmail(user.email, user.emailVerificationToken);

    const { password: _, ...result } = user.toObject();
    return result;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new BadRequestException('Email not found');
    }

    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.usersService.updatePasswordResetToken(
      user._id,
      resetToken,
      resetExpires,
    );

    // TODO: Send reset password email
    // await this.sendResetPasswordEmail(user.email, resetToken);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByPasswordResetToken(
      resetPasswordDto.token,
    );

    if (!user || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.password,
      this.configService.get<number>('app.bcryptRounds'),
    );

    await this.usersService.updatePassword(user._id, hashedPassword);
    await this.usersService.clearPasswordResetToken(user._id);

    return { message: 'Password reset successfully' };
  }

  async refreshToken(user: any) {
    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByEmailVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.usersService.verifyEmail(user._id);

    return { message: 'Email verified successfully' };
  }
}
