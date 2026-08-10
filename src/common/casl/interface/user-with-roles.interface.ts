import { userStatus, scopType, resources, permissionAction, clientType } from "src/common/database/schema";
export interface UserWithRoles {
    id: number;
    name: string;
    email: string;
    status: userStatus | "ACTIVE";
    role: {
        id: number;
        name: string;
        scopeType: scopType;
        permissions: Array<{
            id: number;
            name: string;
            resource: resources;
            action: permissionAction;
        }>;
    };
    client: {
        id: number;
        businessName: string;
        type: clientType | "MERCHANT";
        status: userStatus;
    }
}