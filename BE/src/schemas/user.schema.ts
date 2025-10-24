import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export interface UserPreferences {
  language: 'vi' | 'en';
  timezone: string;
  currency: 'VND' | 'USD' | 'EUR';
  notifications: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  avatar?: string;

  @Prop()
  avatarThumbnail?: string;

  @Prop()
  phone?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: {
      language: { type: String, enum: ['vi', 'en'], default: 'vi' },
      timezone: { type: String, default: 'Asia/Ho_Chi_Minh' },
      currency: { type: String, enum: ['VND', 'USD', 'EUR'], default: 'VND' },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
    },
    default: {
      language: 'vi',
      timezone: 'Asia/Ho_Chi_Minh',
      currency: 'VND',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
  })
  preferences: UserPreferences;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ emailVerificationToken: 1 });
UserSchema.index({ passwordResetToken: 1 });
