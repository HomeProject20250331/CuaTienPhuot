import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsString()
  @IsOptional()
  groupId?: string;

  @ApiProperty({
    example: 'new_expense',
    enum: [
      'new_expense',
      'new_member',
      'settlement_request',
      'settlement_completed',
      'debt_reminder',
      'group_invite',
    ],
  })
  @IsEnum([
    'new_expense',
    'new_member',
    'settlement_request',
    'settlement_completed',
    'debt_reminder',
    'group_invite',
  ])
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'New expense added' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'John added a new expense of 100,000 VND' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: { expenseId: '507f1f77bcf86cd799439011', amount: 100000 },
    required: false,
  })
  @IsObject()
  @IsOptional()
  data?: any;

  @ApiProperty({ example: '2024-12-31T23:59:59.000Z', required: false })
  @IsOptional()
  expiresAt?: Date;
}
