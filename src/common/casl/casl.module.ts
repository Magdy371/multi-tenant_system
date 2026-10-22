import { Global, Module } from "@nestjs/common";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { RoleNamesModule } from "../roles/role-names.module";

@Global()
@Module({
    imports: [RoleNamesModule],
    providers: [CaslAbilityFactory],
    exports: [CaslAbilityFactory],
})
export class CaslModule { }
