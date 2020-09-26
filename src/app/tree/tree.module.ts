import { TreeService } from './tree.service';
import { Module } from '@nestjs/common';
import { TreeController } from './tree.controller';

@Module({
  controllers: [TreeController],
  providers: [TreeService],
})
export class TreeModule {}
