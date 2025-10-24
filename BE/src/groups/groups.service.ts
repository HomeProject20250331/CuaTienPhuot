import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Group, GroupDocument } from '../schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import {
  AddMemberDto,
  JoinGroupDto,
  UpdateGroupDto,
  UpdateMemberRoleDto,
} from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async create(
    createGroupDto: CreateGroupDto,
    createdBy: string,
  ): Promise<GroupDocument> {
    const inviteCode = this.generateInviteCode();
    const group = new this.groupModel({
      ...createGroupDto,
      createdBy,
      inviteCode,
      inviteCodeExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return group.save();
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: GroupDocument[];
    pagination: { page: number; limit: number; total: number };
  }> {
    const skip = (page - 1) * limit;
    const groups = await this.groupModel
      .find({
        'members.userId': userId,
        isActive: true,
      })
      .populate('createdBy', '_id fullName email avatar')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.groupModel.countDocuments({
      'members.userId': userId,
      isActive: true,
    });

    return {
      data: groups,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async findOne(id: string, userId: string): Promise<GroupDocument> {
    const group = await this.groupModel
      .aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
            'members.userId': new mongoose.Types.ObjectId(userId),
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'members.userId',
            foreignField: '_id',
            as: 'memberUsers',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdByUser',
          },
        },
        {
          $addFields: {
            members: {
              $map: {
                input: '$members',
                as: 'member',
                in: {
                  $mergeObjects: [
                    '$$member',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$memberUsers',
                            cond: { $eq: ['$$this._id', '$$member.userId'] },
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
            createdBy: { $arrayElemAt: ['$createdByUser', 0] },
          },
        },
        {
          $project: {
            memberUsers: 0,
            createdByUser: 0,
          },
        },
      ])
      .exec();

    if (!group) {
      throw new NotFoundException('Group not found or you are not a member');
    }
    return group[0];
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
    userId: string,
  ): Promise<GroupDocument> {
    const group = await this.findOne(id, userId);

    // Check if user is admin
    const member = group.members.find((m) => m.userId.toString() === userId);
    if (member.role !== 'admin') {
      throw new ForbiddenException('Only admins can update group');
    }

    Object.assign(group, updateGroupDto);
    return group.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const group = await this.findOne(id, userId);

    // Check if user is admin
    const member = group.members.find((m) => m.userId.toString() === userId);
    if (member.role !== 'admin') {
      throw new ForbiddenException('Only admins can delete group');
    }

    // Soft delete
    await this.groupModel.findByIdAndUpdate(id, { isActive: false });
  }

  async joinGroup(
    joinGroupDto: JoinGroupDto,
    userId: string,
  ): Promise<GroupDocument> {
    const group = await this.groupModel.findOne({
      inviteCode: joinGroupDto.inviteCode,
      inviteCodeExpires: { $gt: new Date() },
      isActive: true,
    });

    if (!group) {
      throw new BadRequestException('Invalid or expired invite code');
    }

    // Check if user is already a member
    const existingMember = group.members.find(
      (m) => m.userId.toString() === userId,
    );
    if (existingMember) {
      throw new ConflictException('You are already a member of this group');
    }

    // Add user to group
    group.members.push({
      userId: userId as any,
      role: 'member',
      joinedAt: new Date(),
      isActive: true,
    });

    return group.save();
  }

  async leaveGroup(id: string, userId: string): Promise<void> {
    const group = await this.findOne(id, userId);

    // Check if user is admin and there are other admins
    const member = group.members.find((m) => m.userId.toString() === userId);
    if (member.role === 'admin') {
      const adminCount = group.members.filter(
        (m) => m.role === 'admin' && m.isActive,
      ).length;
      if (adminCount <= 1) {
        throw new BadRequestException(
          'Cannot leave group as the only admin. Transfer admin role first.',
        );
      }
    }

    // Remove user from group
    group.members = group.members.filter((m) => m.userId.toString() !== userId);
    await group.save();
  }

  async addMember(
    id: string,
    addMemberDto: AddMemberDto,
    userId: string,
  ): Promise<GroupDocument> {
    const group = await this.findOne(id, userId);

    // Check if user is admin
    const member = group.members.find((m) => m.userId.toString() === userId);
    if (member.role !== 'admin') {
      throw new ForbiddenException('Only admins can add members');
    }

    // Check if user is already a member
    const existingMember = group.members.find(
      (m) => m.userId.toString() === addMemberDto.userId,
    );
    if (existingMember) {
      throw new ConflictException('User is already a member of this group');
    }

    // Add member to group
    group.members.push({
      userId: addMemberDto.userId as any,
      role: addMemberDto.role,
      joinedAt: new Date(),
      isActive: true,
    });

    return group.save();
  }

  async removeMember(
    id: string,
    memberId: string,
    userId: string,
  ): Promise<void> {
    const group = await this.findOne(id, userId);

    // Check if user is admin
    const member = group.members.find((m) => m.userId.toString() === userId);
    if (member.role !== 'admin') {
      throw new ForbiddenException('Only admins can remove members');
    }

    // Check if trying to remove the last admin
    const targetMember = group.members.find(
      (m) => m.userId.toString() === memberId,
    );
    if (targetMember.role === 'admin') {
      const adminCount = group.members.filter(
        (m) => m.role === 'admin' && m.isActive,
      ).length;
      if (adminCount <= 1) {
        throw new BadRequestException('Cannot remove the last admin');
      }
    }

    // Remove member from group
    group.members = group.members.filter(
      (m) => m.userId.toString() !== memberId,
    );
    await group.save();
  }

  async updateMemberRole(
    id: string,
    memberId: string,
    updateMemberRoleDto: UpdateMemberRoleDto,
    userId: string,
  ): Promise<void> {
    const group = await this.findOne(id, userId);

    // Check if user is admin
    const member = group.members.find((m) => m.userId.toString() === userId);
    if (member.role !== 'admin') {
      throw new ForbiddenException('Only admins can update member roles');
    }

    // Find and update member role
    const targetMember = group.members.find(
      (m) => m.userId.toString() === memberId,
    );
    if (!targetMember) {
      throw new NotFoundException('Member not found');
    }

    targetMember.role = updateMemberRoleDto.role;
    await group.save();
  }

  async regenerateInviteCode(
    id: string,
    userId: string,
  ): Promise<{ inviteCode: string }> {
    const group = await this.findOne(id, userId);

    // Check if user is admin
    const member = group.members.find((m) => m.userId.toString() === userId);
    if (member.role !== 'admin') {
      throw new ForbiddenException('Only admins can regenerate invite code');
    }

    const newInviteCode = this.generateInviteCode();
    group.inviteCode = newInviteCode;
    group.inviteCodeExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await group.save();

    return { inviteCode: newInviteCode };
  }

  async getMembers(
    id: string,
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: any[];
    pagination: { page: number; limit: number; total: number };
  }> {
    const group = await this.findOne(id, userId);

    const skip = (page - 1) * limit;
    const members = group.members
      .filter((member) => member.isActive)
      .slice(skip, skip + limit);

    const total = group.members.filter((member) => member.isActive).length;

    return {
      data: members,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  private generateInviteCode(): string {
    return uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
  }
}
