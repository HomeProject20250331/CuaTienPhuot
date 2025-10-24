import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SettlementDocument = Settlement & Document;

@Schema({ _id: false })
export class CalculationData {
  @Prop({ required: true, min: 0 })
  originalDebt: number;

  @Prop({ required: true, min: 0 })
  netAmount: number;

  @Prop({ required: true })
  calculationMethod: string;

  @Prop({ type: [Types.ObjectId], ref: 'Expense' })
  relatedExpenses: Types.ObjectId[];
}

@Schema({ timestamps: true })
export class Settlement {
  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  groupId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  fromUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  toUser: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: 'VND' })
  currency: string;

  @Prop()
  description?: string;

  @Prop({ enum: ['pending', 'completed', 'cancelled'], default: 'pending' })
  status: string;

  @Prop({
    enum: ['cash', 'bank_transfer', 'momo', 'zalopay', 'other'],
  })
  paymentMethod?: string;

  @Prop()
  paymentReference?: string;

  @Prop({ type: CalculationData, required: true })
  calculationData: CalculationData;

  @Prop()
  paidAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const SettlementSchema = SchemaFactory.createForClass(Settlement);

// Indexes
SettlementSchema.index({ groupId: 1, status: 1 });
SettlementSchema.index({ groupId: 1, fromUser: 1 });
SettlementSchema.index({ groupId: 1, toUser: 1 });
SettlementSchema.index({ 'calculationData.relatedExpenses': 1 });
SettlementSchema.index({ status: 1, createdAt: -1 });
