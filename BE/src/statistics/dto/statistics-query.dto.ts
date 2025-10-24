import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class StatisticsQueryDto {
  @ApiProperty({ example: '2024-01-01', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    example: 'month',
    enum: ['day', 'week', 'month', 'year'],
    required: false,
  })
  @IsEnum(['day', 'week', 'month', 'year'])
  @IsOptional()
  period?: string;

  @ApiProperty({
    example: 'food',
    enum: [
      'food',
      'transport',
      'accommodation',
      'entertainment',
      'shopping',
      'other',
    ],
    required: false,
  })
  @IsEnum([
    'food',
    'transport',
    'accommodation',
    'entertainment',
    'shopping',
    'other',
  ])
  @IsOptional()
  category?: string;
}
