import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', required: false })
  @IsOptional()
  readAt?: Date;
}

export class MarkAllAsReadDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsOptional()
  groupId?: string;
}
