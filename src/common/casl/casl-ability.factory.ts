import { Injectable } from '@nestjs/common';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  ForcedSubject,
} from '@casl/ability';
import {
  permissionAction,
  resources,
  scopeType,
  userStatus,
} from 'src/common/database/schema_enums';
import { UserWithRoles } from './interface/user-with-roles.interface';
import { RoleNameService } from '../roles/role-name.service';
import { isArray } from 'class-validator';

//Actions that can be performed
export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';

export type Subjects =
  'User' | 'Role' | 'Client' | 'Permission' | 'Branch' | 'Vendor' | 'all';

// Role names are now dynamic from database - using string type
export type RoleName = string;

export type ScopeType = 'MASTER' | 'CLIENT' | 'VENDOR' | 'BRANCH';

export type SubjectType = ForcedSubject<Subjects> | Subjects;

export type AppAbility = Ability<[Actions, SubjectType]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

// Helper type for conditions
export interface PermissionConditions {
  clientId?: number | number[];
  branchId?: number | number[];
  vendorId?: number | number[];
  userId?: number;
  status?: string | string[];
  [key: string]: any;
}
@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly roleNamesService: RoleNameService) { }
  createForUser(user: UserWithRoles) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(AppAbility);

    //Check is UserWithRoles is valid
    if (!user) {
      return build();
    }

    try {
      //Check is UserWithRoles is active
      if (user.status !== userStatus.ACTIVE) {
        return build();
      }

      // Build user context for scope-based permissions
      const userContext = {
        userId: user.id,
        clientId: user.client?.id,
      };
      //Process Each role Binding
      user.roleBindings.forEach((binding) => {
        const roleName = binding.role.name;

        if (roleName === 'MASTER_ADMIN') {
          can('manage', 'all');
          return; //Skip the next binding
        }
        const scopType = binding.scopeType;
        const scopeId = binding.scopeId;
        const permissions = binding.permissions;

        //Build Scope conditions based on scope type and id
        const scopeConditions: PermissionConditions = {};
        if (scopType === scopeType.CLIENT && userContext.clientId) {
          scopeConditions.clientId = userContext.clientId;
        } else if (scopType === scopeType.VENDOR && scopeId) {
          scopeConditions.vendorId = scopeId;
          if (userContext.clientId) {
            scopeConditions.clientId = userContext.clientId;
          }
        } else if (scopType === scopeType.BRANCH && scopeId) {
          scopeConditions.branchId = scopeId;
          if (userContext.clientId) {
            scopeConditions.clientId = userContext.clientId;
          }
        }

        //Apply Permissions from the roleBindings
        if (permissions && isArray(permissions)) {
          permissions.forEach((permission) => {
            const action = permission.action.toLocaleLowerCase() as Actions;
            const subject = this.resourceToSubject(permission.resource);
            if (action && subject) {
              can(action, subject, scopeConditions);
            }
          });
        }
      });
      return build({
        detectSubjectType: (item: unknown) =>
          (item as { constructor: unknown })
            .constructor as ExtractSubjectType<Subjects>,
      });
    } catch (error) {
      throw new Error((error as Error)?.message || 'Error creating ability for user');
    }
  }

  private resourceToSubject(resource: string): Subjects | null {
    const resourceMap: Record<string, Subjects> = {
      USER: 'User',
      ROLE: 'Role',
      PERMISSION: 'Permission',
      CLIENT: 'Client',
      VENDOR: 'Vendor',
      BRANCH: 'Branch',
    };
    return resourceMap[resource] || null;
  }
}
