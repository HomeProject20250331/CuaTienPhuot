import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense, ExpenseDocument } from '../schemas/expense.schema';
import { Group, GroupDocument } from '../schemas/group.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: string,
  ): Promise<ExpenseDocument> {
    // Verify user is member of group
    const group = await this.groupModel.findOne({
      _id: createExpenseDto.groupId,
      'members.userId': userId,
      isActive: true,
    });

    if (!group) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Verify paidBy is member of group
    const paidByMember = group.members.find(
      (m) => m.userId.toString() === createExpenseDto.paidBy,
    );
    if (!paidByMember) {
      throw new BadRequestException(
        'Paid by user is not a member of this group',
      );
    }

    // Verify all participants are members of group
    for (const participant of createExpenseDto.participants) {
      const member = group.members.find(
        (m) => m.userId.toString() === participant.userId,
      );
      if (!member) {
        throw new BadRequestException(
          `Participant ${participant.userId} is not a member of this group`,
        );
      }
    }

    // Calculate split amounts based on split type
    const calculatedParticipants = this.calculateSplitAmounts(
      createExpenseDto.amount,
      createExpenseDto.participants,
      createExpenseDto.splitType || 'equal',
    );

    const expense = new this.expenseModel({
      ...createExpenseDto,
      participants: calculatedParticipants,
      createdBy: userId,
      calculationMetadata: {
        totalParticipants: calculatedParticipants.length,
        baseAmount: createExpenseDto.amount / calculatedParticipants.length,
        remainder: createExpenseDto.amount % calculatedParticipants.length,
        calculationVersion: '1.0',
        lastCalculatedAt: new Date(),
      },
    });

    const savedExpense = await expense.save();

    // Update group total expenses
    await this.groupModel.findByIdAndUpdate(createExpenseDto.groupId, {
      $inc: { totalExpenses: createExpenseDto.amount },
    });

    return savedExpense;
  }

  async findAll(
    groupId: string,
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: ExpenseDocument[];
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
    const expenses = await this.expenseModel
      .find({
        groupId: group._id,
        isActive: true,
      })
      .populate('paidBy', 'fullName email avatar phone')
      .populate('participants.userId', 'fullName email avatar phone')
      .populate('createdBy', 'fullName email avatar phone')
      .skip(skip)
      .limit(limit)
      .sort({ expenseDate: -1 });

    const total = await this.expenseModel.countDocuments({
      groupId,
      isActive: true,
    });

    return {
      data: expenses,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async findOne(id: string, userId: string): Promise<ExpenseDocument> {
    const expense = await this.expenseModel
      .findOne({ _id: id, isActive: true })
      .populate('paidBy', 'fullName email avatar phone')
      .populate('participants.userId', 'fullName email avatar phone')
      .populate('createdBy', 'fullName email avatar phone');

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Verify user is member of group
    const group = await this.groupModel.findOne({
      _id: expense.groupId,
      'members.userId': userId,
      isActive: true,
    });

    if (!group) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
    userId: string,
  ): Promise<ExpenseDocument> {
    const expense = await this.findOne(id, userId);

    // Check if user can edit (creator or admin)
    const group = await this.groupModel.findOne({
      _id: expense.groupId,
      'members.userId': userId,
      isActive: true,
    });

    const member = group.members.find((m) => m.userId.toString() === userId);
    const canEdit =
      expense.createdBy.toString() === userId || member.role === 'admin';

    if (!canEdit) {
      throw new ForbiddenException(
        'You can only edit your own expenses or be an admin',
      );
    }

    // If amount or participants changed, recalculate
    if (
      updateExpenseDto.amount ||
      updateExpenseDto.participants ||
      updateExpenseDto.splitType
    ) {
      const newAmount = updateExpenseDto.amount || expense.amount;
      const newParticipants =
        updateExpenseDto.participants || expense.participants;
      const newSplitType = updateExpenseDto.splitType || expense.splitType;

      const calculatedParticipants = this.calculateSplitAmounts(
        newAmount,
        newParticipants,
        newSplitType,
      );

      updateExpenseDto.participants = calculatedParticipants;
      (updateExpenseDto as any).calculationMetadata = {
        totalParticipants: calculatedParticipants.length,
        baseAmount: newAmount / calculatedParticipants.length,
        remainder: newAmount % calculatedParticipants.length,
        calculationVersion: '1.0',
        lastCalculatedAt: new Date(),
      };
    }

    Object.assign(expense, updateExpenseDto);
    return expense.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const expense = await this.findOne(id, userId);

    // Check if user can delete (creator or admin)
    const group = await this.groupModel.findOne({
      _id: expense.groupId,
      'members.userId': userId,
      isActive: true,
    });

    const member = group.members.find((m) => m.userId.toString() === userId);
    const canDelete =
      expense.createdBy.toString() === userId || member.role === 'admin';

    if (!canDelete) {
      throw new ForbiddenException(
        'You can only delete your own expenses or be an admin',
      );
    }

    // Soft delete
    await this.expenseModel.findByIdAndUpdate(id, { isActive: false });

    // Update group total expenses
    await this.groupModel.findByIdAndUpdate(expense.groupId, {
      $inc: { totalExpenses: -expense.amount },
    });
  }

  async getGroupBalances(groupId: string, userId: string): Promise<any> {
    // Verify user is member of group
    const group = await this.groupModel.findOne({
      _id: groupId,
      'members.userId': userId,
      isActive: true,
    });

    if (!group) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Get all expenses for the group
    const expenses = await this.expenseModel.find({
      groupId,
      isActive: true,
    });

    // Calculate balances for each member
    const balances = new Map();

    // Initialize balances
    for (const member of group.members) {
      balances.set(member.userId.toString(), {
        userId: member.userId,
        totalPaid: 0,
        totalOwed: 0,
        netBalance: 0,
      });
    }

    // Calculate balances from expenses
    for (const expense of expenses) {
      const paidBy = expense.paidBy.toString();
      const paidAmount = expense.amount;

      // Add to paid amount
      if (balances.has(paidBy)) {
        balances.get(paidBy).totalPaid += paidAmount;
      }

      // Add to owed amounts for participants
      for (const participant of expense.participants) {
        const participantId = participant.userId.toString();
        if (balances.has(participantId)) {
          balances.get(participantId).totalOwed += participant.amount;
        }
      }
    }

    // Calculate net balances
    for (const [userId, balance] of balances) {
      balance.netBalance = balance.totalPaid - balance.totalOwed;
    }

    return Array.from(balances.values());
  }

  private calculateSplitAmounts(
    amount: number,
    participants: any[],
    splitType: string,
  ): any[] {
    switch (splitType) {
      case 'equal':
        return this.calculateEqualSplit(amount, participants);
      case 'proportional':
        return this.calculateProportionalSplit(amount, participants);
      case 'custom':
        return this.calculateCustomSplit(amount, participants);
      default:
        return this.calculateEqualSplit(amount, participants);
    }
  }

  private calculateEqualSplit(amount: number, participants: any[]): any[] {
    const baseAmount = Math.floor(amount / participants.length);
    const remainder = amount % participants.length;

    return participants.map((participant, index) => ({
      ...participant,
      amount: baseAmount + (index < remainder ? 1 : 0),
    }));
  }

  private calculateProportionalSplit(
    amount: number,
    participants: any[],
  ): any[] {
    const totalWeight = participants.reduce(
      (sum, p) => sum + (p.weight || 1),
      0,
    );
    const baseAmount = amount / totalWeight;

    return participants.map((participant) => ({
      ...participant,
      amount: Math.floor(baseAmount * (participant.weight || 1)),
    }));
  }

  private calculateCustomSplit(amount: number, participants: any[]): any[] {
    const totalCustomAmount = participants.reduce(
      (sum, p) => sum + (p.customAmount || 0),
      0,
    );

    if (Math.abs(totalCustomAmount - amount) > 0.01) {
      throw new BadRequestException(
        'Custom amounts must sum to the total expense amount',
      );
    }

    return participants.map((participant) => ({
      ...participant,
      amount: participant.customAmount || 0,
    }));
  }
}
