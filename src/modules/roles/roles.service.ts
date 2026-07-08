import { Role } from './interfaces/roles.interface'
import { IRolesService } from './interfaces/roles-service.interface'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { roles, rolesRelations, users } from '../../common/database/schema'
import { DrizzleService } from 'src/common/database/drizzle.service'
import { and, eq, isNull } from 'drizzle-orm'

@Injectable()
export class roleservice implements IRolesService {
    constructor(private drizzle: DrizzleService) { }
    async create(data: CreateRoleDto): Promise<Role> {
        //check if role name does exist
        const roleName = await this.drizzle.db
            .select()
            .from(roles)
            .where(
                and(
                    eq(roles.name, data.name),
                    eq(roles.isActive, true),
                    isNull(roles.deleted_at)
                )
            )
            .limit(1)
        if (roleName) {
            throw new BadRequestException("role name already exist")
        }
        const [role] = await this.drizzle.db.insert(roles).values({
            name: data.name,
            isGlobal: data.isGlobal,
            isActive: data.isActive,
            description: data.description
        }).returning();

        return {
            id: role.id,
            name: role.name,
            isGlobal: role.isGlobal,
            isActive: role.isActive,
            description: role.description
        }

    }

    async findOne(id: number): Promise<Role> {
        const [existingRole] = await this.drizzle.db
            .select({
                name: roles.name,
                isActive: roles.isActive,
                isGlobal: roles.isGlobal,
                description: roles.description
            })
            .from(roles)
            .where(
                and(
                    eq(roles.id, id),
                    eq(roles.isActive, true),
                    isNull(roles.deleted_at)
                )
            )
            .limit(1);
        if (!existingRole) {
            throw new NotFoundException("The role not found");
        }
        return {
            id: id,
            name: existingRole.name,
            isActive: existingRole.isActive,
            isGlobal: existingRole.isGlobal,
            description: existingRole.description
        }
    }
    async findAll(): Promise<Role[]> {
        const RoleArray = await this.drizzle.db
            .select({
                id: roles.id,
                name: roles.name,
                isActive: roles.isActive,
                isGlobal: roles.isGlobal,
                description: roles.description
            })
            .from(roles)
            .where(
                and(
                    eq(roles.isActive, true),
                    isNull(roles.deleted_at)
                )
            )
        return RoleArray;
    }
    async update(id: number, data: Partial<UpdateRoleDto>): Promise<Role> {
        const existingRole = await this.findOne(id);
        const updatedData: Record<string, unknown> = {
            name: data.name !== undefined ? data.name : existingRole.name,
            isActive: data.isActive !== undefined ? data.isActive : existingRole.isActive,
            isGlobal: data.isGlobal !== undefined ? data.isGlobal : existingRole.isGlobal,
            description: data.description !== undefined ? data.description : existingRole.description
        }
        const [updatedRole] = await this.drizzle.db
            .update(roles)
            .set(updatedData)
            .where(eq(roles.id, id))
            .returning();
        return {
            id: id,
            name: updatedRole.name,
            isGlobal: updatedRole.isGlobal,
            isActive: updatedRole.isActive,
            description: updatedRole.description
        };
    }
    async remove(id: number): Promise<{ message: string }> {
        await this.findOne(id);
        await this.drizzle.db
            .update(roles)
            .set({
                deleted_at: new Date()
            })
            .where(eq(roles.id, id))
        return { message: "Role deleted successfully" };
    }

}
