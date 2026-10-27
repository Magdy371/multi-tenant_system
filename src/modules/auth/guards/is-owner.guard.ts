import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
} from "@nestjs/common"

import { Reflector } from "@nestjs/core";
import { IS_OWNER_KEY } from "../decorators/is-owner.decorator";
import { CaslAbilityFactory } from "src/common/casl/casl-ability.factory";
import { Observable } from "rxjs";

/**
 * Guard to check if the user is the owner of a resource
 * Works in combination with @IsOwner decorator
 *
 * Logic:
 * 1. Extracts the parameter name from @IsOwner decorator
 * 2. Gets the resource ID from route parameters
 * 3. Checks if user.id matches the resource ID OR user has admin abilities
 * 4. Admins can access any resource, owners can only access their own
 */
@Injectable()
export class IsOwnerGurad implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const paramName = this.reflector.get<string>(
            IS_OWNER_KEY,
            context.getHandler(),
        )
        //// If no @IsOwner decorator, allow access
        if (!paramName) {
            return true;
        }
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user) throw new ForbiddenException("User not Authenticated");
        const resourceId = parseInt(req.parameters[paramName], 10);
        if (!resourceId || isNaN(resourceId)) throw new ForbiddenException(`Invalid ${paramName} parameter`);
        if (user.id === resourceId) {
            return true;
        }
        const role_name: string = req.roleBindings.role.name;
        if (role_name === "MASTER_ADMIN") {
            return true;
        }
        throw new ForbiddenException("Do not have Permission to this resource");
    }
}