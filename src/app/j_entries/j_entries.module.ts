import { J_entriesService } from './j_entries.service';
import { Module } from '@nestjs/common';
import { J_entriesController } from './j_entries.controller';

@Module({
  controllers: [J_entriesController],
  providers: [J_entriesService],
})
export class J_entriesModule {}
