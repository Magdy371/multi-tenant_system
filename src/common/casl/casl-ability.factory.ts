import { Injectable } from "@nestjs/common";
import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { permissionAction, resources } from "../database/schema";
import { UserWithRoles } from "./interface/user-with-roles.interface";
import { roleservice } from "src/modules/roles/roles.service";


@Injectable()
export class CaslAbilityFactory {
    constructor(
        private readonly roleService: roleservice
    ) { }
    createForUser(user: UserWithRoles) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

        if (user.status == "SUSPENDED") {
            return build();
        }

    }
}