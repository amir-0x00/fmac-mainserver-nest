import { User } from 'src/shared/decorators/User.decorator';
import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateVouchersDTO, UpdateVouchersDTO } from './vouchers.entity';
import { VouchersService } from './vouchers.service';
import { useLock } from 'src/shared/decorators/Lock.decorator';
import { JEntry, EJAutoNotes } from '../j_entries/j_entries.create';

export type TVouchers_types = 'imp' | 'exp';

@useLock()
@Controller('(:type)_vouchers')
export class VouchersController {
  constructor(private vouchersService: VouchersService) {}

  @Get('getall')
  async findAll(@Param('type') type: TVouchers_types) {
    // console.log('bdy', EJAutoNotes.inv_sales_banks_point);
    // new JEntry('treasury', {'notes_i':})
    return await this.vouchersService.getAll(type);
  }

  @Post('add')
  async create(@Param('type') type: TVouchers_types, @Body() createVouchersDTO: CreateVouchersDTO) {
    return await this.vouchersService.create(type, createVouchersDTO);
  }

  @Put('edit/:id')
  async update(
    @Param('type') type: TVouchers_types,
    @Param('id', ParseIntPipe) id: number,
    @Body() bodyDTO: UpdateVouchersDTO,
    @User('i') user_id: number,
  ) {
    return await this.vouchersService.update(type, id, bodyDTO, user_id);
  }

  @Delete('delete/:id')
  async delete(@Param('type') type: TVouchers_types, @Param('id', ParseIntPipe) id: number) {
    return await this.vouchersService.delete(type, id);
  }
}
