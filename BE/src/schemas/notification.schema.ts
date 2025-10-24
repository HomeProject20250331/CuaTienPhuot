import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ _id: false })
export class NotificationData {
  @Prop({ type: Types.ObjectId, ref: 'Expense' })
  expenseId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Settlement' })
  settlementId?: Types.ObjectId;

  @Prop()
  amount?: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  fromUser?: Types.ObjectId;

  @Prop()
  groupName?: string;
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Group' })
  groupId?: Types.ObjectId;

  @Prop({
    enum: [
      'new_expense',
      'new_member',
      'settlement_request',
      'settlement_completed',
      'debt_reminder',
      'group_invite',
    ],
    required: true,
  })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: NotificationData })
  data?: NotificationData;

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  readAt?: Date;

  @Prop()
  expiresAt?: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Indexes
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1 });
NotificationSchema.index({ groupId: 1, type: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
