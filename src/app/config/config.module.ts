import { ConfigService } from './config.service';
import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';

@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}
