import {ApiProperty} from "@nestjs/swagger";
import {
    IsString,
    IsEmail,
} from "class-validator";
export class CreateUserDto {
    @ApiProperty({description: "name"})
    @IsString()
    name!: string;

    @ApiProperty({description: "email"})
    @IsString()
    @IsEmail()
    email!: string;

    @ApiProperty({description: "password"})
    @IsString()
    password!: string;
}
