import { ExecutionContext } from '@nestjs/common';
import { AppAbility, Subjects, Actions } from './casl-ability.factory';

/**
 * Simple policy helpers for common permission patterns
 */
export class PolicyHelpers {
  /**
   * Check basic permission - user must have this permission in their abilities
   */
  static can(action: Actions, subject: Subjects) {
    return (ability: AppAbility) => ability.can(action, subject);
  }

  /**
   * Check if user owns the resource (for their own profile, etc.)
   */
  static isOwner(userIdField: string = 'id') {
    return (ability: AppAbility, context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const resourceId = request.params[userIdField];

      // Allow if user owns the resource or is admin
      return user.id === parseInt(resourceId) || ability.can('manage', 'all');
    };
  }

  /**
   * Require ALL conditions to pass
   */
  static and(
    ...policies: Array<
      (ability: AppAbility, context: ExecutionContext) => boolean
    >
  ) {
    return (ability: AppAbility, context: ExecutionContext) => {
      return policies.every((policy) => policy(ability, context));
    };
  }

  /**
   * Require ANY condition to pass
   */
  static or(
    ...policies: Array<
      (ability: AppAbility, context: ExecutionContext) => boolean
    >
  ) {
    return (ability: AppAbility, context: ExecutionContext) => {
      return policies.some((policy) => policy(ability, context));
    };
  }
}
