import { Module } from '@nestjs/common';
import { DatabaseModule } from "./common/database/database.module"
import { UsersModule } from "./modules/users/users.module";
import { RoleModule } from "./modules/roles/roles.module";
import { PermissionsModule } from "./modules/permissions/permissions.module";

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    RoleModule,
    PermissionsModule,
  ],
})
export class AppModule { }
