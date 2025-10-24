import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({ example: 'Updated Trip to Da Nang', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Updated summer vacation description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/new-cover.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ example: 'USD', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 'America/New_York', required: false })
  @IsString()
  @IsOptional()
  timezone?: string;
}

export class JoinGroupDto {
  @ApiProperty({ example: 'ABC123XYZ' })
  @IsString()
  @IsNotEmpty()
  inviteCode: string;
}

export class AddMemberDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'member', enum: ['admin', 'member'] })
  @IsEnum(['admin', 'member'])
  role: string;
}

export class UpdateMemberRoleDto {
  @ApiProperty({ example: 'admin', enum: ['admin', 'member'] })
  @IsEnum(['admin', 'member'])
  role: string;
}
