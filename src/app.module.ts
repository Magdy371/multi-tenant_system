import { Module } from '@nestjs/common';
import { DatabaseModule } from "./common/database/database.module"
import { UsersModule } from "./modules/users/users.module";
import { RoleModule } from "./modules/roles/roles.module";

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    RoleModule
  ],
})
export class AppModule { }
