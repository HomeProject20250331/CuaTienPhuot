import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ _id: false })
export class GroupMember {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ enum: ['admin', 'member'], default: 'member' })
  role: string;

  @Prop({ default: Date.now })
  joinedAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

@Schema({ _id: false })
export class GroupSettings {
  @Prop({ default: true })
  allowMemberAddExpense: boolean;

  @Prop({ default: false })
  requireApprovalForExpense: boolean;

  @Prop({ type: Types.ObjectId, ref: 'PaymentFormula' })
  defaultPaymentFormula?: Types.ObjectId;

  @Prop({
    type: {
      newExpense: { type: Boolean, default: true },
      newMember: { type: Boolean, default: true },
      settlement: { type: Boolean, default: true },
      reminder: { type: Boolean, default: true },
    },
    default: {
      newExpense: true,
      newMember: true,
      settlement: true,
      reminder: true,
    },
  })
  notificationSettings: {
    newExpense: boolean;
    newMember: boolean;
    settlement: boolean;
    reminder: boolean;
  };
}

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true, maxlength: 100 })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  coverImage?: string;

  @Prop({ default: 'VND' })
  currency: string;

  @Prop({ default: 'Asia/Ho_Chi_Minh' })
  timezone: string;

  @Prop({ type: GroupSettings, default: () => ({}) })
  settings: GroupSettings;

  @Prop({ type: [GroupMember], required: true })
  members: GroupMember[];

  @Prop({ unique: true })
  inviteCode: string;

  @Prop({ default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
  inviteCodeExpires: Date;

  @Prop({ default: 0 })
  totalExpenses: number;

  @Prop({ default: 0 })
  totalSettlements: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

// Indexes
GroupSchema.index({ inviteCode: 1 }, { unique: true });
GroupSchema.index({ 'members.userId': 1 });
GroupSchema.index({ createdBy: 1 });
GroupSchema.index({ createdAt: -1 });
