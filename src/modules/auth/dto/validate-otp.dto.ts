import { IsEmail, IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ValidateOtpDto {
    @ApiProperty({ description: "User email address" })
    @IsEmail()
    email!: string;

    @ApiPropertyOptional({ description: "Business name (optional for MASTER_ADMIN)" })
    @IsOptional()
    @IsString()
    businessName?: string;

    @ApiProperty({ description: "OTP received via email" })
    @IsString()
    @IsNotEmpty()
    otp!: string;
}
