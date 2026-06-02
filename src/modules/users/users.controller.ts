import {
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Param, Delete, Patch
} from "@nestjs/common";

import {
  ApiBody,
  ApiOperation, ApiParam, ApiProperty,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";

@ApiTags("Users")
@Controller("users")

export class UsersController {
  constructor(private readonly userService: UserService) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create user" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User created successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad request - duplicate email or invalid data",
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get User by Id" })
  @ApiParam({ name: "id", type: Number })
  async findOne(@Param("id") id: number) {
    return await this.userService.findOne(id);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all Users" })
  async findAll() {
    return this.userService.findAll();
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update User" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User updated successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "User update failed",
  })
  @ApiParam({ name: "id", type: Number })
  async update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete User" })
  @ApiParam({ name: "id", type: Number })
  async delete(@Param("id") id: number) {
    return await this.userService.remove(id);
  }
}

