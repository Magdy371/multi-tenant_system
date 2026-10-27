import { SetMetadata } from '@nestjs/common';
import { AppAbility } from '../../../common/casl/casl-ability.factory';

export interface PolicyHandler {
  handle(ability: AppAbility, context: any): boolean | Promise<boolean>;
}

export type PolicyHandlerCallback = (
  ability: AppAbility,
  context: any,
) => boolean | Promise<boolean>;

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (
  ...handlers: (PolicyHandler | PolicyHandlerCallback)[]
) => SetMetadata(CHECK_POLICIES_KEY, handlers);
