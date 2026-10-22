import { IsEmail, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateOtpDto {
    @ApiProperty({ description: "User email address" })
    @IsEmail()
    email!: string;

    @ApiProperty({ description: "Business name" })
    @IsString()
    @IsNotEmpty()
    businessName?: string;

    @ApiProperty({ description: "OTP received via email" })
    @IsString()
    @IsNotEmpty()
    otp!: string;
}
