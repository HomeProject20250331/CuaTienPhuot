import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSettlementDto {
  @ApiProperty({ example: 150000, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 'Updated payment description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'completed',
    enum: ['pending', 'completed', 'cancelled'],
    required: false,
  })
  @IsEnum(['pending', 'completed', 'cancelled'])
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: 'bank_transfer',
    enum: ['cash', 'bank_transfer', 'momo', 'zalopay', 'other'],
    required: false,
  })
  @IsEnum(['cash', 'bank_transfer', 'momo', 'zalopay', 'other'])
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ example: 'REF789012', required: false })
  @IsString()
  @IsOptional()
  paymentReference?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', required: false })
  @IsOptional()
  paidAt?: Date;
}
