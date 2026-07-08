import {scopType, resources, permissionAction} from "../../../common/database/schema";

export interface IPermission {
  id: number;
  name: string | null;
  scope: scopType | null;
  description: string | null;
  resource: resources | null;
  action: permissionAction | null;
  isActive: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}
