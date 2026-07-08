import { roleservice } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { Role } from "./interfaces/roles.interface";

@ApiTags("Roles")
@Controller("roles")
export class RolesController {
    constructor(private roleService: roleservice) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Create new role" })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Roles created successfully",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request - duplicate role name",
    })
    @ApiBody({ type: CreateRoleDto })
    async create(@Body() data: CreateRoleDto) {
        return await this.roleService.create(data);
    }

    @Get(":id")
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiOperation({ summary: "Get role by id" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Request Accepted"
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Bad request - role with ths id cannot be found",
    })
    @ApiParam({ name: "id", type: Number })
    async findOne(@Param("id") id: number) {
        return await this.roleService.findOne(id);
    }

    @Get()
    @ApiOperation({ summary: "Gell all roles in the system" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Request Accepted"
    })
    async findAll() {
        return await this.roleService.findAll();
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update role by id" })
    @ApiResponse({
        status: HttpStatus.ACCEPTED,
        description: "Update request accepted"
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Bad request - role with ths id cannot be found",
    })
    @ApiParam({ name: "id", type: Number })
    @ApiBody({ type: UpdateRoleDto })
    async update(@Param("id") id: number, @Body() data: UpdateRoleDto) {
        return await this.roleService.update(id, data);
    }

    @Delete(":id")
    @ApiOperation({ summary: "soft delete role" })
    @ApiParam({ name: "id", type: Number })
    async remove(@Param("id") id: number) {
        return await this.roleService.remove(id);
    }

}
