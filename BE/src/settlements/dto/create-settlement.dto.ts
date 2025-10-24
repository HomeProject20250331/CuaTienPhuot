import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateSettlementDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  groupId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  fromUser: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsNotEmpty()
  @IsString()
  toUser: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'VND', default: 'VND' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 'Payment for dinner', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'cash',
    enum: ['cash', 'bank_transfer', 'momo', 'zalopay', 'other'],
    required: false,
  })
  @IsEnum(['cash', 'bank_transfer', 'momo', 'zalopay', 'other'])
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ example: 'REF123456', required: false })
  @IsString()
  @IsOptional()
  paymentReference?: string;
}
