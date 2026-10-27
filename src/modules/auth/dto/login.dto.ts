import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, ApiPropertyOptions } from '@nestjs/swagger';
import { IsNotDisposableEmail } from 'src/common/validators/email.validator';

export class LoginDto {
    @ApiPropertyOptional({
        description:
            "Business Name (optional, not required for MASTER_ADMIN, required for client users)",
        example: "v2",
    })
    @IsOptional()
    @IsString()
    businessName?: string;

    @ApiProperty({ description: "User email" })
    @IsEmail()
    @IsNotDisposableEmail()
    email!: string;

    @ApiProperty({ description: "User password" })
    @IsString()
    @MinLength(6)
    password!: string;
}
