import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ExpenseParticipantDto, LocationDto, ReceiptDto } from './create-expense.dto';

export class UpdateExpenseDto {
  @ApiProperty({ example: 'Updated dinner at restaurant', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 600000, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 'entertainment', enum: ['food', 'transport', 'accommodation', 'entertainment', 'shopping', 'other'], required: false })
  @IsEnum(['food', 'transport', 'accommodation', 'entertainment', 'shopping', 'other'])
  @IsOptional()
  category?: string;

  @ApiProperty({ example: 'proportional', enum: ['equal', 'proportional', 'custom'], required: false })
  @IsEnum(['equal', 'proportional', 'custom'])
  @IsOptional()
  splitType?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', required: false })
  @IsString()
  @IsOptional()
  paidBy?: string;

  @ApiProperty({ type: [ExpenseParticipantDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseParticipantDto)
  @IsOptional()
  participants?: ExpenseParticipantDto[];

  @ApiProperty({ type: ReceiptDto, required: false })
  @ValidateNested()
  @Type(() => ReceiptDto)
  @IsOptional()
  receipt?: ReceiptDto;

  @ApiProperty({ example: ['lunch', 'cafe'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ type: LocationDto, required: false })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @ApiProperty({ example: '2024-01-16T12:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  expenseDate?: Date;
}
