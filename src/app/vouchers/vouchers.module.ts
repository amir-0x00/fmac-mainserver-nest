import { VouchersService } from './vouchers.service';
import { Module } from '@nestjs/common';
import { VouchersController } from './vouchers.controller';

@Module({
  controllers: [VouchersController],
  providers: [VouchersService],
})
export class VouchersModule {}
