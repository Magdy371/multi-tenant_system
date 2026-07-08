import { CreatePermissionDto } from "./dto/create-dto";
import { UpdatePermissionDto } from "./dto/update-dto";
import { PermissionSerivce } from "./permissions.service";
import {Controller, HttpCode, Injectable, Post, Get, HttpStatus, Body, Patch, Param, Delete} from "@nestjs/common";
import {ApiBody, ApiOperation, ApiParam, ApiProperty, ApiTags} from "@nestjs/swagger";
import {IPermission} from "./interfaces/permissions.interface";


@ApiTags("Permissions")
@Controller("permissions")
@Injectable()
export class PermissionsController {
  constructor(
    private readonly service: PermissionSerivce
  ) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({description: "Create permission"})
  @ApiBody({type: CreatePermissionDto })
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<IPermission> {
    return await this.service.create(createPermissionDto);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({description: "Get permission by Id"})
  @ApiParam({ name: "id", type: Number })
  async findOne(@Param("id")  id: number): Promise<IPermission> {
    return await this.service.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({description: "Get All permissions"})
  async findAll(): Promise<IPermission[]> {
    return await this.service.findAll();
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({description: "Update permission"})
  @ApiParam({ name: "id", type: Number })
  @ApiBody({type: UpdatePermissionDto })
  async update(@Param("id") id: number, @Body() updatePermissionDto: UpdatePermissionDto): Promise<IPermission> {
    return await this.service.update(id, updatePermissionDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({description: "Delete permission"})
  @ApiParam({ name: "id", type: Number })
  async delete(@Param("id") id: number): Promise<{ message: string }> {
    return await this.service.delete(id);
  }
}
