import {
  scopeType,
  resources,
  permissionAction,
} from '../../../common/database/schema_enums';

export interface IPermission {
  id: number;
  name: string | null;
  scope: scopeType | null;
  description: string | null;
  resource: resources | null;
  action: permissionAction | null;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}
