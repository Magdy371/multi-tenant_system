import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
    @ApiProperty({ description: "User email address" })
    @IsEmail()
    email!: string;

    @ApiProperty({ description: "Business name" })
    @IsString()
    businessName?: string;
}