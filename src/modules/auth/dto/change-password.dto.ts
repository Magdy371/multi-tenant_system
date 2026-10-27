import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Match } from "../decorators/match.decorator";

export class ChangePasswordDto {
    @ApiProperty({
        description: "New password",
        example: "NewPass123!",
        minLength: 8,
    })
    @IsNotEmpty({ message: "New password is required" })
    @IsString()
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message:
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)",
    })
    newPassword!: string;

    @ApiProperty({
        description: "Confirm new password",
        example: "NewPass123!",
    })
    @IsNotEmpty({ message: "Password confirmation is required" })
    @IsString()
    @Match("newPassword", { message: "Passwords do not match" })
    confirmPassword!: string;
}

export class UserChangePasswordDto extends ChangePasswordDto {
    @ApiProperty({
        description: "Current password",
        example: "OldPass123!",
    })
    @IsNotEmpty({ message: "Current password is required" })
    @IsString()
    currentPassword!: string;
}

export class AdminChangePasswordDto extends ChangePasswordDto {
    // Inherits newPassword and confirmPassword from ChangePasswordDto
    // Admin doesn't need to provide current password when changing other users' passwords
}

// New DTO for client admin changing their own password
export class ClientAdminChangePasswordDto extends ChangePasswordDto {
    @ApiProperty({
        description:
            "Current password (required for CLIENT_ADMIN changing their own password)",
        example: "OldPass123!",
        required: false,
    })
    @IsOptional()
    @IsString()
    currentPassword?: string;
}