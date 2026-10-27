import { CheckPolicies } from 'src/modules/auth/decorators/check-policies.decorator';
import { Actions, Subjects } from './casl-ability.factory';
import { PolicyHelpers } from './policy-helpers';
/**
 * Simple decorators for permission checking
 */

// Basic permission checks
export const Can = (action: Actions, subject: Subjects) =>
  CheckPolicies(PolicyHelpers.can(action, subject));

export const CanCreate = (subject: Subjects) => Can('create', subject);
export const CanRead = (subject: Subjects) => Can('read', subject);
export const CanUpdate = (subject: Subjects) => Can('update', subject);
export const CanDelete = (subject: Subjects) => Can('delete', subject);
export const CanManage = (subject: Subjects) => Can('manage', subject);

export const IsOwner = (userIdField: string = 'id') =>
  CheckPolicies(PolicyHelpers.isOwner(userIdField));

// Combined policies
export const RequireAll = (
  ...policies: Array<(ability: any, context: any) => boolean>
) => CheckPolicies(PolicyHelpers.and(...policies));

export const AllowAny = (
  ...policies: Array<(ability: any, context: any) => boolean>
) => CheckPolicies(PolicyHelpers.or(...policies));
