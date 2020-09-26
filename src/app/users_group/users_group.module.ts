import { Users_groupService } from './users_group.service';
import { Module } from '@nestjs/common';
import { Users_groupController } from './users_group.controller';

@Module({
  controllers: [Users_groupController],
  providers: [Users_groupService],
})
export class Users_groupModule {}
