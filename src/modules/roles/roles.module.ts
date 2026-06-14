import { Module } from "@nestjs/common";
import { RoleService } from "./roles.service";
import { DatabaseModule } from "src/common/database/database.module";
import { RolesController } from "./roles.controller";
@Module({
    imports: [DatabaseModule],
    controllers: [RolesController],
    providers: [RoleService]
})
export class RoleModule { }