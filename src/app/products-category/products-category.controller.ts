import { LockInterceptor } from '../../shared/Lock/Lock.interceptor';
import { sleep } from 'src/utils/utils';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';

let x = 1;

@Controller('products-category')
export class ProductsCategoryController {
  @Get(':id')
  async findAll(@Param('id') id): Promise<string> {
    // await sleep(2000);
    // if (id === '2') {
    //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // }
    return 'This action returns all cats';
  }

  @Get('edit/:id')
  @UseInterceptors(LockInterceptor)
  async edit(@Param('id', ParseIntPipe) id: number): Promise<string> {
    console.log('start', x);
    if (id === 2) {
      await sleep(2000);
      x++;
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    } else {
      await sleep(4000);
    }
    x++;
    console.log('end');
    return 'This action edit a cat';
  }
}
