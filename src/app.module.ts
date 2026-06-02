import { Module } from '@nestjs/common';
import { DatabaseModule } from "./common/database/database.module"
import { UsersModule} from "./modules/users/users.module";

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
  ],
})
export class AppModule {}
