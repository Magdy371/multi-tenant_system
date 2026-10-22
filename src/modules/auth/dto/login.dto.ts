import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsNotDisposableEmail } from 'src/common/validators/email.validator';

export class LoginDto {
    @ApiProperty({
        description:
            "client name domain",
        example: "pro",
    })
    @IsString()
    bussinessName?: string;

    @ApiProperty({ description: "User email" })
    @IsEmail()
    @IsNotDisposableEmail()
    email!: string;

    @ApiProperty({ description: "User password" })
    @IsString()
    @MinLength(6)
    password!: string;
}