import { IPermission } from "./permissions.interface";
import {CreatePermissionDto} from "../dto/create-dto";
import {UpdatePermissionDto} from "../dto/update-dto";
export interface IPermissionsService {
  create(data: CreatePermissionDto): Promise<IPermission>;
  update(id: number, data: UpdatePermissionDto): Promise<IPermission>;
  findOne(id: number): Promise<IPermission>;
  findAll(id: number): Promise<IPermission[]>;
  delete(id: number): Promise<{message: "the permission deleted successfully"}>;
}
