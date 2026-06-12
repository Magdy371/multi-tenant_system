import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsOptional,
} from "class-validator";
export class UpdateUserDto {
  @ApiProperty({ description: "name" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: "email" })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: "password" })
  @IsString()
  @IsOptional()
  password?: string;
}
