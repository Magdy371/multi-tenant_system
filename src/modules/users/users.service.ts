import { Users } from "../../common/database/schema";
import { DrizzleService } from "../../common/database/drizzle.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { and, eq, isNull } from "drizzle-orm";
import { CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";

export interface UserEntity {
  id?: number | null;
  name?: string | null;
  email?: string | null;
}

@Injectable()
export class UserService {
  constructor(private drizzle: DrizzleService) { }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    if (!dto.email) {
      throw new BadRequestException("Email is required");
    }
    if (!dto.password) {
      throw new BadRequestException("Password is required");
    }
    if (!dto.name) {
      throw new BadRequestException("Name is required");
    }

    const existingEmail = await this.drizzle.db
      .select()
      .from(Users)
      .where(
        and(
          eq(Users.email, dto.email),
          isNull(Users.deleted_at)
        ))
      .limit(1);

    if (existingEmail.length > 0) {
      throw new BadRequestException("Email already exists");
    }

    const [user] = await this.drizzle.db.insert(Users).values({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      created_at: new Date()
    })
      .returning();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async findOne(id: number): Promise<UserEntity> {
    //find the user
    const [user] = await this.drizzle.db
      .select({
        id: Users.id,
        name: Users.name,
        email: Users.email,
      })
      .from(Users)
      .where(
        and(
          eq(Users.id, id),
          isNull(Users.deleted_at)
        ))
      .limit(1);
    if (!user) {
      throw new BadRequestException("User does not exist");
    }
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.drizzle.db
      .select({
        id: Users.id,
        name: Users.name,
        email: Users.email,
      })
      .from(Users).where(isNull(Users.deleted_at))
    if (users.length === 0) {
      throw new BadRequestException("No users found.");
    }
    return users;
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    const existingUser = await this.findOne(id);
    const updatedData: Record<string, unknown> = {
      name: dto.name !== undefined ? dto.name : existingUser.name,
      email: dto.email !== undefined ? dto.email : existingUser.email,
      updated_at: new Date()
    }
    const updatedUser = await this.drizzle.db
      .update(Users)
      .set(updatedData)
      .where(eq(Users.id, id))
      .returning()
    return {
      id: existingUser.id,
      name: updatedUser[0].name,
      email: updatedUser[0].email,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.drizzle.db
      .update(Users)
      .set({
        deleted_at: new Date()
      })
      .where(eq(Users.id, id))
    return { message: "user deleted successfully." };
  }
}
