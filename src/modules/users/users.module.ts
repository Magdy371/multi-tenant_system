import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { DatabaseModule } from "../../common/database/database.module";
import { UsersController } from "./users.controller";
import { authConfig } from "../../config/auth.config";

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule { }
