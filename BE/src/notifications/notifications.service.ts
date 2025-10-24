import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  MarkAllAsReadDto,
  UpdateNotificationDto,
} from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationDocument> {
    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: NotificationDocument[];
    pagination: { page: number; limit: number; total: number };
  }> {
    const skip = (page - 1) * limit;
    const notifications = await this.notificationModel
      .find({ userId, isActive: true })
      .populate('groupId', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.notificationModel.countDocuments({
      userId,
      isActive: true,
    });

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async findUnread(
    userId: string,
  ): Promise<{ notifications: NotificationDocument[]; total: number }> {
    const notifications = await this.notificationModel
      .find({ userId, isRead: false, isActive: true })
      .populate('groupId', 'name')
      .sort({ createdAt: -1 });

    return { notifications, total: notifications.length };
  }

  async findOne(id: string, userId: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel
      .findOne({ _id: id, userId, isActive: true })
      .populate('groupId', 'name');

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
    userId: string,
  ): Promise<NotificationDocument> {
    const notification = await this.findOne(id, userId);

    // If marking as read, set readAt timestamp
    if (updateNotificationDto.isRead && !notification.isRead) {
      updateNotificationDto.readAt = new Date();
    }

    Object.assign(notification, updateNotificationDto);
    return notification.save();
  }

  async markAllAsRead(
    userId: string,
    markAllAsReadDto: MarkAllAsReadDto,
  ): Promise<{ count: number }> {
    const filter: any = { userId, isRead: false, isActive: true };

    if (markAllAsReadDto.groupId) {
      filter.groupId = markAllAsReadDto.groupId;
    }

    const result = await this.notificationModel.updateMany(filter, {
      isRead: true,
      readAt: new Date(),
    });

    return { count: result.modifiedCount };
  }

  async remove(id: string, userId: string): Promise<void> {
    const notification = await this.findOne(id, userId);

    // Soft delete
    await this.notificationModel.findByIdAndUpdate(id, { isActive: false });
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.notificationModel.countDocuments({
      userId,
      isRead: false,
      isActive: true,
    });

    return { count };
  }

  async getNotificationStats(userId: string): Promise<any> {
    const total = await this.notificationModel.countDocuments({
      userId,
      isActive: true,
    });
    const unread = await this.notificationModel.countDocuments({
      userId,
      isRead: false,
      isActive: true,
    });
    const read = total - unread;

    // Get notifications by type
    const byType = await this.notificationModel.aggregate([
      { $match: { userId, isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    return {
      total,
      unread,
      read,
      byType,
    };
  }

  // Helper methods for creating specific notification types
  async createExpenseNotification(
    userId: string,
    groupId: string,
    expenseData: any,
  ): Promise<NotificationDocument> {
    return this.create({
      userId,
      groupId,
      type: 'new_expense',
      title: 'New expense added',
      message: `${expenseData.paidByName} added a new expense of ${expenseData.amount} ${expenseData.currency}`,
      data: {
        expenseId: expenseData.expenseId,
        amount: expenseData.amount,
        fromUser: expenseData.paidBy,
      },
    });
  }

  async createMemberNotification(
    userId: string,
    groupId: string,
    memberData: any,
  ): Promise<NotificationDocument> {
    return this.create({
      userId,
      groupId,
      type: 'new_member',
      title: 'New member joined',
      message: `${memberData.memberName} joined the group`,
      data: {
        fromUser: memberData.memberId,
        groupName: memberData.groupName,
      },
    });
  }

  async createSettlementNotification(
    userId: string,
    groupId: string,
    settlementData: any,
  ): Promise<NotificationDocument> {
    return this.create({
      userId,
      groupId,
      type: 'settlement_request',
      title: 'Settlement request',
      message: `${settlementData.fromUserName} requests ${settlementData.amount} ${settlementData.currency} from you`,
      data: {
        settlementId: settlementData.settlementId,
        amount: settlementData.amount,
        fromUser: settlementData.fromUser,
      },
    });
  }

  async createGroupInviteNotification(
    userId: string,
    groupId: string,
    inviteData: any,
  ): Promise<NotificationDocument> {
    return this.create({
      userId,
      groupId,
      type: 'group_invite',
      title: 'Group invitation',
      message: `You've been invited to join ${inviteData.groupName}`,
      data: {
        groupName: inviteData.groupName,
        fromUser: inviteData.invitedBy,
      },
    });
  }
}
