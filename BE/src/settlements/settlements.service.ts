import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from '../schemas/group.schema';
import { Settlement, SettlementDocument } from '../schemas/settlement.schema';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';

@Injectable()
export class SettlementsService {
  constructor(
    @InjectModel(Settlement.name)
    private settlementModel: Model<SettlementDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async create(
    createSettlementDto: CreateSettlementDto,
    userId: string,
  ): Promise<SettlementDocument> {
    // Verify user is member of group
    const group = await this.groupModel.findOne({
      _id: createSettlementDto.groupId,
      'members.userId': userId,
      isActive: true,
    });

    if (!group) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Verify fromUser and toUser are members of group
    const fromUserMember = group.members.find(
      (m) => m.userId.toString() === createSettlementDto.fromUser,
    );
    const toUserMember = group.members.find(
      (m) => m.userId.toString() === createSettlementDto.toUser,
    );

    if (!fromUserMember || !toUserMember) {
      throw new BadRequestException('Both users must be members of this group');
    }

    if (createSettlementDto.fromUser === createSettlementDto.toUser) {
      throw new BadRequestException('From user and to user cannot be the same');
    }

    const settlement = new this.settlementModel({
      ...createSettlementDto,
      createdBy: userId,
      calculationData: {
        originalDebt: createSettlementDto.amount,
        netAmount: createSettlementDto.amount,
        calculationMethod: 'manual',
        relatedExpenses: [],
      },
    });

    const savedSettlement = await settlement.save();

    // Update group total settlements
    await this.groupModel.findByIdAndUpdate(createSettlementDto.groupId, {
      $inc: { totalSettlements: createSettlementDto.amount },
    });

    return savedSettlement;
  }

  async findAll(
    groupId: string,
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: SettlementDocument[];
    pagination: { page: number; limit: number; total: number };
  }> {
    // Verify user is member of group
    const group = await this.groupModel.findOne({
      _id: groupId,
      'members.userId': userId,
      isActive: true,
    });

    if (!group) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const skip = (page - 1) * limit;
    const settlements = await this.settlementModel
      .find({ groupId, isActive: true })
      .populate('fromUser', 'fullName email avatar phone')
      .populate('toUser', 'fullName email avatar phone')
      .populate('createdBy', 'fullName email avatar phone')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.settlementModel.countDocuments({
      groupId,
      isActive: true,
    });

    return {
      data: settlements,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async findOne(id: string, userId: string): Promise<SettlementDocument> {
    const settlement = await this.settlementModel
      .findOne({ _id: id, isActive: true })
      .populate('fromUser', 'fullName email avatar phone')
      .populate('toUser', 'fullName email avatar phone')
      .populate('createdBy', 'fullName email avatar phone');

    if (!settlement) {
      throw new NotFoundException('Settlement not found');
    }

    // Verify user is member of group
    const group = await this.groupModel.findOne({
      _id: settlement.groupId,
      'members.userId': userId,
      isActive: true,
    });

    if (!group) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return settlement;
  }

  async update(
    id: string,
    updateSettlementDto: UpdateSettlementDto,
    userId: string,
  ): Promise<SettlementDocument> {
    const settlement = await this.findOne(id, userId);

    // Check if user can edit (creator or admin)
    const group = await this.groupModel.findOne({
      _id: settlement.groupId,
      'members.userId': userId,
      isActive: true,
    });

    const member = group.members.find((m) => m.userId.toString() === userId);
    const canEdit =
      settlement.createdBy.toString() === userId || member.role === 'admin';

    if (!canEdit) {
      throw new ForbiddenException(
        'You can only edit your own settlements or be an admin',
      );
    }

    // If status is being changed to completed, set paidAt
    if (
      updateSettlementDto.status === 'completed' &&
      settlement.status !== 'completed'
    ) {
      updateSettlementDto.paidAt = new Date();
    }

    Object.assign(settlement, updateSettlementDto);
    return settlement.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const settlement = await this.findOne(id, userId);

    // Check if user can delete (creator or admin)
    const group = await this.groupModel.findOne({
      _id: settlement.groupId,
      'members.userId': userId,
      isActive: true,
    });

    const member = group.members.find((m) => m.userId.toString() === userId);
    const canDelete =
      settlement.createdBy.toString() === userId || member.role === 'admin';

    if (!canDelete) {
      throw new ForbiddenException(
        'You can only delete your own settlements or be an admin',
      );
    }

    // Soft delete
    await this.settlementModel.findByIdAndUpdate(id, { isActive: false });

    // Update group total settlements
    await this.groupModel.findByIdAndUpdate(settlement.groupId, {
      $inc: { totalSettlements: -settlement.amount },
    });
  }

  async getSettlementSummary(groupId: string, userId: string): Promise<any> {
    // Verify user is member of group
    const group = await this.groupModel.findOne({
      _id: groupId,
      'members.userId': userId,
      isActive: true,
    });

    if (!group) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Get settlement statistics
    const totalSettlements = await this.settlementModel.countDocuments({
      groupId,
      isActive: true,
    });

    const completedSettlements = await this.settlementModel.countDocuments({
      groupId,
      status: 'completed',
      isActive: true,
    });

    const pendingSettlements = await this.settlementModel.countDocuments({
      groupId,
      status: 'pending',
      isActive: true,
    });

    const totalAmount = await this.settlementModel.aggregate([
      { $match: { groupId, isActive: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return {
      totalSettlements,
      completedSettlements,
      pendingSettlements,
      totalAmount: totalAmount[0]?.total || 0,
    };
  }
}
