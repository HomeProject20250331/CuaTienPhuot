import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExpenseDocument = Expense & Document;

@Schema({ _id: false })
export class ExpenseParticipant {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop()
  paidAt?: Date;

  @Prop({ default: 1, min: 0 })
  weight: number;

  @Prop({ min: 0 })
  customAmount?: number;
}

@Schema({ _id: false })
export class Receipt {
  @Prop()
  imageUrl?: string;

  @Prop()
  fileName?: string;

  @Prop()
  fileSize?: number;

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

@Schema({ _id: false })
export class Location {
  @Prop()
  name?: string;

  @Prop({
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
  })
  coordinates?: {
    lat: number;
    lng: number;
  };
}

@Schema({ _id: false })
export class CalculationMetadata {
  @Prop({ required: true })
  totalParticipants: number;

  @Prop({ required: true, min: 0 })
  baseAmount: number;

  @Prop({ default: 0 })
  remainder: number;

  @Prop({ default: '1.0' })
  calculationVersion: string;

  @Prop({ default: Date.now })
  lastCalculatedAt: Date;
}

@Schema({ timestamps: true })
export class Expense {
  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  groupId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: 'VND' })
  currency: string;

  @Prop({
    enum: ['food', 'transport', 'accommodation', 'entertainment', 'shopping', 'other'],
    required: true,
  })
  category: string;

  @Prop({ enum: ['equal', 'proportional', 'custom'], default: 'equal' })
  splitType: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  paidBy: Types.ObjectId;

  @Prop({ type: [ExpenseParticipant], required: true })
  participants: ExpenseParticipant[];

  @Prop({ type: Receipt })
  receipt?: Receipt;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ type: Location })
  location?: Location;

  @Prop({ required: true, default: Date.now })
  expenseDate: Date;

  @Prop({ type: CalculationMetadata, required: true })
  calculationMetadata: CalculationMetadata;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

// Indexes
ExpenseSchema.index({ groupId: 1, expenseDate: -1 });
ExpenseSchema.index({ groupId: 1, category: 1 });
ExpenseSchema.index({ groupId: 1, paidBy: 1 });
ExpenseSchema.index({ groupId: 1, splitType: 1 });
ExpenseSchema.index({ 'participants.userId': 1 });
ExpenseSchema.index({ 'calculationMetadata.lastCalculatedAt': -1 });
ExpenseSchema.index({ createdAt: -1 });
