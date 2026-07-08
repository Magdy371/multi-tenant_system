import { Module } from '@nestjs/common';
import { PermissionSerivce} from "./permissions.service";
import { PermissionsController} from "./permissions.controller";
import { DatabaseModule} from "../../common/database/database.module";
@Module({
  imports: [DatabaseModule],
  controllers: [PermissionsController],
  providers:[PermissionSerivce],
})
export class PermissionsModule {}
