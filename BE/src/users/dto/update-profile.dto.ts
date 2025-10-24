import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class NotificationPreferencesDto {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  sms?: boolean;
}

export class UserPreferencesDto {
  @ApiProperty({ example: 'vi', enum: ['vi', 'en'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['vi', 'en'])
  language?: 'vi' | 'en';

  @ApiProperty({ example: 'Asia/Ho_Chi_Minh', required: false })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({ example: 'VND', enum: ['VND', 'USD', 'EUR'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['VND', 'USD', 'EUR'])
  currency?: 'VND' | 'USD' | 'EUR';

  @ApiProperty({ type: NotificationPreferencesDto, required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => NotificationPreferencesDto)
  notifications?: NotificationPreferencesDto;
}

export class UpdateProfileDto {
  @ApiProperty({ example: 'Nguyễn Văn B', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string;

  @ApiProperty({ example: '+84901234568', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^(\+84|0)[0-9]{9,10}$/, {
    message: 'Phone number must be a valid Vietnamese phone number',
  })
  phone?: string;

  @ApiProperty({ type: UserPreferencesDto, required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UserPreferencesDto)
  preferences?: UserPreferencesDto;
}
