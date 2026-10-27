import {
    Injectable,
    ExecutionContext,
    CanActivate,
    ForbiddenException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ownerConfig } from "../decorators/resource-owner.decorator";
import { RESOURCE_OWNER_KEY } from "../decorators/resource-owner.decorator";
import { CaslAbilityFactory, Subjects } from "src/common/casl/casl-ability.factory";
@Injectable()
export class ResourceOwnerGuard implements CanActivate {
    constructor(private reflector: Reflector,
        private caslAbility: CaslAbilityFactory,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const config = this.reflector.get<ownerConfig>(
            RESOURCE_OWNER_KEY,
            context.getHandler()
        );
        if (!config) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) throw new ForbiddenException("User Not Authinticated");
        const ability = this.caslAbility.createForUser(user);
        const resourceSubject = (config.resourceType.charAt(0).toUpperCase() + config.resourceType.slice(1)) as Subjects
        if (ability.can("manage", "all") ||
            ability.can("manage", resourceSubject)) {
            return true;
        }
        const resourceId = parseInt(request.params[config.paramName], 10);

        if (!resourceId || isNaN(resourceId)) {
            throw new ForbiddenException(`Invalid ${config.paramName} parameter`);
        }
        if (config.resourceType === "USER") {
            return user.id === resourceId;
        }
        throw new ForbiddenException(`Resource type ${config.resourceType} not supported`,);
    }
}