export { Roles } from '../../../common/database/schema';
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsOptional } from "class-validator";
export class UpdateRoleDto {
    @ApiProperty({ description: "name" })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: "isGlobal" })
    @IsBoolean()
    @IsOptional()
    isGlobal?: boolean;

    @ApiProperty({ description: "isActive" })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ description: "description" })
    @IsOptional()
    @IsString()
    description?: string;
}