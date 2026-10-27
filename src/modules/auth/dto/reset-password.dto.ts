import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class ResetPasswordDto {
  @ApiPropertyOptional({ description: ' Client Domain If exist' })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({ description: ' User Email Address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: ' One Time Password Sent via email' })
  @IsNotEmpty()
  @IsString()
  otp!: string;

  @ApiProperty({
    description: 'New password',
    example: 'NewPass123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)',
  })
  newPassword!: string;
}
