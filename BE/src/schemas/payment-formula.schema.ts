import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentFormulaDocument = PaymentFormula & Document;

@Schema({ timestamps: true })
export class PaymentFormula {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  formula: string;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const PaymentFormulaSchema = SchemaFactory.createForClass(PaymentFormula);

// Indexes
PaymentFormulaSchema.index({ isDefault: 1 });
PaymentFormulaSchema.index({ isActive: 1 });
