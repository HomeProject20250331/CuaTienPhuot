import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class GroupMemberDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'member', enum: ['admin', 'member'] })
  @IsEnum(['admin', 'member'])
  role: string;
}

export class NotificationSettingsDto {
  @ApiProperty({ example: true })
  newExpense: boolean;

  @ApiProperty({ example: true })
  newMember: boolean;

  @ApiProperty({ example: true })
  settlement: boolean;

  @ApiProperty({ example: true })
  reminder: boolean;
}

export class GroupSettingsDto {
  @ApiProperty({ example: true })
  allowMemberAddExpense: boolean;

  @ApiProperty({ example: false })
  requireApprovalForExpense: boolean;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsOptional()
  defaultPaymentFormula?: string;

  @ApiProperty({ type: NotificationSettingsDto })
  @ValidateNested()
  @Type(() => NotificationSettingsDto)
  notificationSettings: NotificationSettingsDto;
}

export class CreateGroupDto {
  @ApiProperty({ example: 'Trip to Da Nang' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Summer vacation with friends', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg', required: false })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ example: 'VND', default: 'VND' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 'Asia/Ho_Chi_Minh', default: 'Asia/Ho_Chi_Minh' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ type: GroupSettingsDto, required: false })
  @ValidateNested()
  @Type(() => GroupSettingsDto)
  @IsOptional()
  settings?: GroupSettingsDto;

  @ApiProperty({ type: [GroupMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupMemberDto)
  members: GroupMemberDto[];
}
