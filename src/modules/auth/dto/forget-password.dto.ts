import { IsEmail, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ForgotPasswordDto {
    @ApiProperty({ description: "User email address" })
    @IsEmail()
    email!: string;

    @ApiPropertyOptional({ description: "Business name (optional for MASTER_ADMIN)" })
    @IsOptional()
    @IsString()
    businessName?: string;
}