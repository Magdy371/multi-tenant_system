import { Module } from '@nestjs/common';
import { RoleNamesService } from './role-names.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RoleNamesService],
  exports: [RoleNamesService],
})
export class RoleNamesModule {}
