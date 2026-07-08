import {permissions} from "../../common/database/schema";
import {CreatePermissionDto} from "./dto/create-dto";
import {UpdatePermissionDto} from "./dto/update-dto";
import {IPermission} from "./interfaces/permissions.interface";
import {IPermissionsService} from "./interfaces/permissions-service.interface";
import {DrizzleService} from "../../common/database/drizzle.service";
import {eq} from "drizzle-orm";
import {ConflictException, NotFoundException} from "@nestjs/common";

export class PermissionSerivce implements IPermissionsService {
  constructor(private readonly drizzleService: DrizzleService) {
  }

  async create(data: CreatePermissionDto): Promise<IPermission> {
    //check existing permission
    const [existingPermission] = await this.drizzleService.db.select()
      .from(permissions)
      .where(eq(permissions.name, CreatePermissionDto.name))
      .limit(1);
    if(existingPermission) {
      throw new ConflictException('Permission already exists');
    }
    const [createdPermission] = await this.drizzleService.db.insert(permissions)
      .values(data).returning();
    return {
      id: createdPermission.id,
      name: createdPermission.name,
      scope: createdPermission.scope,
      description: createdPermission.description,
      resource: createdPermission.resource,
      action: createdPermission.action,
      isActive: createdPermission.isActive,
      created_at:createdPermission.created_at,
      updated_at: createdPermission.updated_at
    };
  }

  async delete(id: number): Promise<{ message: "the permission deleted successfully" }> {
    await this.findOne(id);
    await this.drizzleService.db.delete(permissions)
      .where(eq(permissions.id, id));
    return {message: "the permission deleted successfully"};
  }

  async findAll(): Promise<IPermission[]> {
    return this.drizzleService.db.select().from(permissions);
  }

  async findOne(id: number): Promise<IPermission> {
    const [existingPermission] = await this.drizzleService.db.select().from(permissions)
      .where(eq(permissions.id, id));
    if(!existingPermission) {
      throw new NotFoundException("Permission not found");
    }
    return existingPermission;
  }

  async update(id: number, data: UpdatePermissionDto): Promise<IPermission> {
    const existingPermission = await this.findOne(id);
    const updatedData: Record<string, unknown> = {
      updated_at: new Date(),
    }
    if(data.name !== undefined ){
      updatedData.name = data.name;
    }
    if(data.scope !== undefined ){
      updatedData.scope = data.scope;
    }
    if(data.description !== undefined ){
      updatedData.description = data.description;
    }
    if(data.action !== undefined ){
      updatedData.action = data.action;
    }
    if (data.resource !== undefined ){
      updatedData.resource = data.resource;
    }
    if(data.isActive !== undefined ){
      updatedData.isActive = data.isActive;
    }
    const [updatedRecord] = await this.drizzleService.db.update(permissions)
      .set(updatedData)
      .where(eq(permissions.id, id))
      .returning();
    return updatedRecord;
  }

}
