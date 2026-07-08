export { roles } from '../../../common/database/schema';
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsOptional } from "class-validator";
export class CreateRoleDto {
    @ApiProperty({ description: "name" })
    @IsString()
    name!: string;

    @ApiProperty({ description: "isGlobal" })
    @IsBoolean()
    isGlobal!: boolean;

    @ApiProperty({ description: "isActive" })
    @IsBoolean()
    isActive!: boolean;

    @ApiProperty({ description: "description" })
    @IsOptional()
    @IsString()
    description?: string;
}
