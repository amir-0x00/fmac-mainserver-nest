import { User } from './../../shared/decorators/User.decorator';
import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateProductsDTO, UpdateProductsDTO } from './products.entity';
import { ProductsService } from './products.service';
import { useLock } from 'src/shared/decorators/Lock.decorator';

export type TProducts_types = 'imp' | 'exp';

@useLock()
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('getall')
  async findAll() {
    // console.log('bdy', EJAutoNotes.inv_sales_banks_point);
    // new JEntry('treasury', {'notes_i':})
    return await this.productsService.getAll();
  }

  @Post('add')
  async create(@Body() createProductsDTO: CreateProductsDTO) {
    return await this.productsService.create(createProductsDTO);
  }

  @Put('edit/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() bodyDTO: UpdateProductsDTO, @User('i') user_id: number) {
    return await this.productsService.update(id, bodyDTO, user_id);
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.delete(id);
  }
}
