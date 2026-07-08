import { Module } from "@nestjs/common";
import { roleservice } from "./roles.service";
import { DatabaseModule } from "src/common/database/database.module";
import { RolesController } from "./roles.controller";
@Module({
    imports: [DatabaseModule],
    controllers: [RolesController],
    providers: [roleservice]
})
export class RoleModule { }
