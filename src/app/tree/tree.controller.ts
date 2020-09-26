import { User } from './../../shared/decorators/User.decorator';
import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateTreeDTO, UpdateTreeDTO } from './tree.entity';
import { TreeService } from './tree.service';
import { useLock } from 'src/shared/decorators/Lock.decorator';

@useLock()
@Controller('tree')
export class TreeController {
  constructor(private treeService: TreeService) {}

  @Post('add')
  async create(@Body() createTreeDTO: CreateTreeDTO) {
    return await this.treeService.create(createTreeDTO);
  }

  @Get('getall')
  async findAll() {
    return await this.treeService.getAll();
  }

  @Put('edit/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() bodyDTO: UpdateTreeDTO, @User('i') user_id: number) {
    return await this.treeService.update(id, bodyDTO, user_id);
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.treeService.delete(id);
  }
}
