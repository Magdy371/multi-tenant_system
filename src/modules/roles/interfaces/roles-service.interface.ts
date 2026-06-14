import { Role } from './roles.interface'
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
export interface IRolesService {
    create(data: CreateRoleDto): Promise<Role>;
    findOne(id: number): Promise<Role>;
    findAll(): Promise<Role[]>
    update(id: number, data: Partial<UpdateRoleDto>): Promise<Role>
    remove(id: number): Promise<{ message: string }>
}