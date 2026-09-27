import {
  userStatus,
  scopeType,
  clientType,
} from '../../../common/database/schema_enums';
export interface UserWithRoles {
  id: number;
  name: string;
  email: string;
  status: userStatus | 'ACTIVE';
  clientId: number;
  roleBindings: Array<{
    role: {
      name: string;
      isSub: boolean;
    };
    scopeType: scopeType;
    scopeId: number | null;
    permissions?: Array<{
      id: number;
      name: string;
      resource: string;
      action: string;
    }>;
  }>;
  client: {
    id: number;
    domain: string;
    type: clientType | 'COURIER';
    status: userStatus;
  };
}
