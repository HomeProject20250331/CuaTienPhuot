import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense, ExpenseDocument } from '../schemas/expense.schema';
import { Group, GroupDocument } from '../schemas/group.schema';
import { Settlement, SettlementDocument } from '../schemas/settlement.schema';
import { StatisticsQueryDto } from './dto/statistics-query.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
    @InjectModel(Settlement.name)
    private settlementModel: Model<SettlementDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async getGroupStatistics(
    groupId: string,
    userId: string,
    query: StatisticsQueryDto,
  ): Promise<any> {
    // Verify user is member of group
    const group = await this.groupModel.findOne({
      _id: groupId,
      'members.userId': userId,
      isActive: true,
    });

    if (!group) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const { startDate, endDate, category } = query;

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    // Build expense filter
    const expenseFilter: any = { groupId, isActive: true };
    if (Object.keys(dateFilter).length > 0) {
      expenseFilter.expenseDate = dateFilter;
    }
    if (category) {
      expenseFilter.category = category;
    }

    // Get expense statistics
    const expenseStats = await this.expenseModel.aggregate([
      { $match: expenseFilter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalExpenses: { $sum: 1 },
          averageAmount: { $avg: '$amount' },
          maxAmount: { $max: '$amount' },
          minAmount: { $min: '$amount' },
        },
      },
    ]);

    // Get expenses by category
    const expensesByCategory = await this.expenseModel.aggregate([
      { $match: expenseFilter },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    // Get expenses by user
    const expensesByUser = await this.expenseModel.aggregate([
      { $match: expenseFilter },
      {
        $group: {
          _id: '$paidBy',
          totalPaid: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalPaid: -1 } },
    ]);

    // Get settlement statistics
    const settlementFilter: any = { groupId, isActive: true };
    if (Object.keys(dateFilter).length > 0) {
      settlementFilter.createdAt = dateFilter;
    }

    const settlementStats = await this.settlementModel.aggregate([
      { $match: settlementFilter },
      {
        $group: {
          _id: null,
          totalSettlements: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          completedSettlements: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          pendingSettlements: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
        },
      },
    ]);

    // Get monthly trends
    const monthlyTrends = await this.expenseModel.aggregate([
      { $match: expenseFilter },
      {
        $group: {
          _id: {
            year: { $year: '$expenseDate' },
            month: { $month: '$expenseDate' },
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return {
      expenseStats: expenseStats[0] || {
        totalAmount: 0,
        totalExpenses: 0,
        averageAmount: 0,
        maxAmount: 0,
        minAmount: 0,
      },
      expensesByCategory,
      expensesByUser,
      settlementStats: settlementStats[0] || {
        totalSettlements: 0,
        totalAmount: 0,
        completedSettlements: 0,
        pendingSettlements: 0,
      },
      monthlyTrends,
    };
  }

  async getUserStatistics(
    userId: string,
    query: StatisticsQueryDto,
  ): Promise<any> {
    const { startDate, endDate, category } = query;

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    // Build expense filter
    const expenseFilter: any = {
      'participants.userId': userId,
      isActive: true,
    };
    if (Object.keys(dateFilter).length > 0) {
      expenseFilter.expenseDate = dateFilter;
    }
    if (category) {
      expenseFilter.category = category;
    }

    // Get user's expense participation
    const userExpenses = await this.expenseModel.aggregate([
      { $match: expenseFilter },
      { $unwind: '$participants' },
      { $match: { 'participants.userId': userId } },
      {
        $group: {
          _id: null,
          totalOwed: { $sum: '$participants.amount' },
          totalPaid: {
            $sum: { $cond: [{ $eq: ['$paidBy', userId] }, '$amount', 0] },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get user's settlements
    const userSettlements = await this.settlementModel.aggregate([
      {
        $match: {
          $or: [{ fromUser: userId }, { toUser: userId }],
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalSettlements: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          sentAmount: {
            $sum: { $cond: [{ $eq: ['$fromUser', userId] }, '$amount', 0] },
          },
          receivedAmount: {
            $sum: { $cond: [{ $eq: ['$toUser', userId] }, '$amount', 0] },
          },
        },
      },
    ]);

    // Get user's groups
    const userGroups = await this.groupModel
      .find({
        'members.userId': userId,
        isActive: true,
      })
      .select('name totalExpenses totalSettlements');

    return {
      userExpenses: userExpenses[0] || {
        totalOwed: 0,
        totalPaid: 0,
        count: 0,
      },
      userSettlements: userSettlements[0] || {
        totalSettlements: 0,
        totalAmount: 0,
        sentAmount: 0,
        receivedAmount: 0,
      },
      userGroups: userGroups.map((group) => ({
        id: group._id,
        name: group.name,
        totalExpenses: group.totalExpenses,
        totalSettlements: group.totalSettlements,
      })),
    };
  }

  async getExpenseTrends(
    groupId: string,
    userId: string,
    period: string = 'month',
  ): Promise<any> {
    // Verify user is member of group
    const group = await this.groupModel.findOne({
      _id: groupId,
      'members.userId': userId,
      isActive: true,
    });

    if (!group) {
      throw new ForbiddenException('You are not a member of this group');
    }

    let groupBy: any;
    switch (period) {
      case 'day':
        groupBy = {
          year: { $year: '$expenseDate' },
          month: { $month: '$expenseDate' },
          day: { $dayOfMonth: '$expenseDate' },
        };
        break;
      case 'week':
        groupBy = {
          year: { $year: '$expenseDate' },
          week: { $week: '$expenseDate' },
        };
        break;
      case 'year':
        groupBy = {
          year: { $year: '$expenseDate' },
        };
        break;
      default: // month
        groupBy = {
          year: { $year: '$expenseDate' },
          month: { $month: '$expenseDate' },
        };
    }

    const trends = await this.expenseModel.aggregate([
      { $match: { groupId, isActive: true } },
      {
        $group: {
          _id: groupBy,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          categories: { $addToSet: '$category' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    return trends;
  }

  async getTopSpenders(
    groupId: string,
    userId: string,
    limit: number = 5,
  ): Promise<any> {
    // Verify user is member of group
    const group = await this.groupModel.findOne({
      _id: groupId,
      'members.userId': userId,
      isActive: true,
    });

    if (!group) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const topSpenders = await this.expenseModel.aggregate([
      { $match: { groupId, isActive: true } },
      {
        $group: {
          _id: '$paidBy',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          averageAmount: { $avg: '$amount' },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: limit },
    ]);

    return topSpenders;
  }

  async getCategoryBreakdown(groupId: string, userId: string): Promise<any> {
    // Verify user is member of group
    const group = await this.groupModel.findOne({
      _id: groupId,
      'members.userId': userId,
      isActive: true,
    });

    if (!group) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const breakdown = await this.expenseModel.aggregate([
      { $match: { groupId, isActive: true } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          percentage: { $sum: '$amount' },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    // Calculate percentages
    const totalAmount = breakdown.reduce(
      (sum, item) => sum + item.totalAmount,
      0,
    );
    const breakdownWithPercentage = breakdown.map((item) => ({
      ...item,
      percentage: totalAmount > 0 ? (item.totalAmount / totalAmount) * 100 : 0,
    }));

    return breakdownWithPercentage;
  }
}
