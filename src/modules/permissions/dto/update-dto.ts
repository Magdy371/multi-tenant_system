import { CreatePermissionDto } from "./create-dto";
import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsOptional, IsString} from "class-validator";
import {permissionAction, resources, scopType} from "../../../common/database/schema";

export class UpdatePermissionDto {
  @ApiProperty({description: "name"})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({description: "scope"})
  @IsString()
  @IsOptional()
  scope: scopType;

  @ApiProperty({description: "description"})
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({description: "permissionAction"})
  @IsString()
  @IsOptional()
  action:permissionAction;

  @ApiProperty({description: "permission resource"})
  @IsString()
  @IsOptional()
  resource: resources;

  @ApiProperty({description: "is Active"})
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
