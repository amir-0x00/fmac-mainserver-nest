import { Module } from '@nestjs/common';
import { ProductsCategoryService } from './products-category.service';

@Module({
  providers: [ProductsCategoryService]
})
export class ProductsCategoryModule {}
