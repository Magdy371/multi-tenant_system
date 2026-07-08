import { users } from '../../common/database/schema';
import { DrizzleService } from '../../common/database/drizzle.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { authConfig } from '../../config/auth.config';
import { IUserService } from './interface/user-service.interface';
import { UserEntity } from './interface/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements IUserService {
  constructor(private drizzle: DrizzleService) { }

  async create(dto: CreateUserDto): Promise<UserEntity> {

    const existingEmail = await this.drizzle.db
      .select()
      .from(users)
      .where(and(eq(users.email, dto.email), isNull(users.deleted_at)))
      .limit(1);

    if (existingEmail.length > 0) {
      throw new BadRequestException('Email already exists');
    }
    let passwordHashed = await bcrypt.hash(
      dto.password,
      authConfig.bcrypt.saltRounds,
    );

    const [user] = await this.drizzle.db
      .insert(users)
      .values({
        name: dto.name,
        email: dto.email,
        password: passwordHashed,
        created_at: new Date(),
      })
      .returning();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      deleted_at: user.deleted_at,
    };
  }

  async findOne(id: number): Promise<UserEntity> {
    //find the user
    const [user] = await this.drizzle.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        created_at: users.created_at,
        updated_at: users.updated_at,
        deleted_at: users.deleted_at,
      })
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deleted_at)))
      .limit(1);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    const allUsers = await this.drizzle.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        created_at: users.created_at,
        updated_at: users.updated_at,
        deleted_at: users.deleted_at,
      })
      .from(users)
      .where(isNull(users.deleted_at));
    if (allUsers.length === 0) {
      throw new BadRequestException('No users found.');
    }
    return allUsers;
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    const existingUser = await this.findOne(id);
    const updatedData: Record<string, unknown> = {
      name: dto.name !== undefined ? dto.name : existingUser.name,
      email: dto.email !== undefined ? dto.email : existingUser.email,
      updated_at: new Date(),
    };
    if (dto.password !== undefined) {
      updatedData.password = await bcrypt.hash(
        dto.password,
        authConfig.bcrypt.saltRounds,
      );
    }
    const updatedUser = await this.drizzle.db
      .update(users)
      .set(updatedData)
      .where(eq(users.id, id))
      .returning();
    return {
      id: existingUser.id,
      name: updatedUser[0].name,
      email: updatedUser[0].email,
      created_at: existingUser.created_at,
      updated_at: updatedUser[0].updated_at,
      deleted_at: existingUser.deleted_at,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.drizzle.db
      .update(users)
      .set({
        deleted_at: new Date(),
      })
      .where(eq(users.id, id));
    return { message: 'user deleted successfully.' };
  }
}
