import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class ExpenseParticipantDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @ApiProperty({ example: 50000, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  customAmount?: number;
}

export class ReceiptDto {
  @ApiProperty({ example: 'https://example.com/receipt.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'receipt.jpg', required: false })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiProperty({ example: 1024000, required: false })
  @IsNumber()
  @IsOptional()
  fileSize?: number;
}

export class LocationDto {
  @ApiProperty({ example: 'Da Nang Beach', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: { lat: 16.0544, lng: 108.2022 }, required: false })
  @IsOptional()
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export class CreateExpenseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  groupId: string;

  @ApiProperty({ example: 'Dinner at restaurant' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Great food and atmosphere', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'VND', default: 'VND' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 'food', enum: ['food', 'transport', 'accommodation', 'entertainment', 'shopping', 'other'] })
  @IsEnum(['food', 'transport', 'accommodation', 'entertainment', 'shopping', 'other'])
  category: string;

  @ApiProperty({ example: 'equal', enum: ['equal', 'proportional', 'custom'], default: 'equal' })
  @IsEnum(['equal', 'proportional', 'custom'])
  @IsOptional()
  splitType?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  paidBy: string;

  @ApiProperty({ type: [ExpenseParticipantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseParticipantDto)
  participants: ExpenseParticipantDto[];

  @ApiProperty({ type: ReceiptDto, required: false })
  @ValidateNested()
  @Type(() => ReceiptDto)
  @IsOptional()
  receipt?: ReceiptDto;

  @ApiProperty({ example: ['dinner', 'restaurant'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ type: LocationDto, required: false })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @ApiProperty({ example: '2024-01-15T18:30:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  expenseDate?: Date;
}
