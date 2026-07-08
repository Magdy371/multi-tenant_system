import {ApiProperty} from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsBoolean, IsEnum
} from "class-validator";
import { scopType, resources, permissionAction} from "../../../common/database/schema";

export class CreatePermissionDto {
  @ApiProperty({description: "name"})
  @IsString()
  name!: string;

  @ApiProperty({description: "scope"})
  @IsString()
  scope!: scopType;

  @ApiProperty({description: "description"})
  @IsString()
  description!: string;

  @ApiProperty({description: "permissionAction"})
  @IsString()
  action!:permissionAction;

  @ApiProperty({description: "permission resource"})
  @IsString()
  resource!: resources;

  @ApiProperty({description: "is Active"})
  @IsString()
  isActive!: boolean;

}
