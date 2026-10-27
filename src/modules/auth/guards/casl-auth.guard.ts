import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CaslAbilityFactory,
  AppAbility,
} from '../../../common/casl/casl-ability.factory';
import { PolicyHandler } from '../decorators/check-policies.decorator';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';

@Injectable()
export class CaslAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory, // Inject the factory
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * The Reflector is a built-in NestJS helper class.
     * Its job is to read metadata (hidden configuration data) that was
     * stamped onto your classes or route handlers via custom decorators.
     */
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        /**
         * This extracts the specific controller function/endpoint that the user is currently trying to access
         * (e.g., findAll(), createUser()). The reflector looks directly at that specific route to see if @CheckPolicies is sitting above it.
         */
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    /**
     * true if the user has at least one role binding where the role name is exactly "MASTER_ADMIN".
     * false if none of the role bindings match "MASTER_ADMIN", or if the roleBindings array is empty.
     */
    const isMasterAdmin = user.roleBindings?.some(
      (rb: any) => rb.role.name === 'MASTER_ADMIN',
    );
    if (isMasterAdmin) {
      return true;
    }
    const ability = this.caslAbilityFactory.createForUser(user);
    const results = await Promise.all(
      policyHandlers.map((handler) =>
        this.execPolicyHandler(handler, ability, context),
      ),
    );
    return results.every((result) => result === true);
  }

  /**
   * The execPolicyHandler function serves as a unified execution bridge for your route permissions.
   * Its sole job is to take a permission check ("handler"), execute it, and return whether the user is allowed to access the route (true or false).
   */
  private execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    if (typeof handler === 'function') {
      return (handler as any)(ability, context);
    }
    return handler.handle(ability, context);
  }
}
