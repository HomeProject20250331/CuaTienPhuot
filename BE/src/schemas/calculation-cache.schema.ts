import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CalculationCacheDocument = CalculationCache & Document;

@Schema({ timestamps: true })
export class CalculationCache {
  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  groupId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  cacheKey: string;

  @Prop({
    enum: ['settlement', 'expense_split', 'balance'],
    required: true,
  })
  calculationType: string;

  @Prop({ type: Object, required: true })
  data: any;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const CalculationCacheSchema = SchemaFactory.createForClass(CalculationCache);

// Indexes
CalculationCacheSchema.index({ groupId: 1, calculationType: 1 });
CalculationCacheSchema.index({ cacheKey: 1 }, { unique: true });
CalculationCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
