import { User } from './../../shared/decorators/User.decorator';
import { sleep } from 'src/utils/utils';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UsePipes,
  UseGuards,
  Res,
} from '@nestjs/common';
import { CreateJ_entriesDTO, UpdateJ_entriesDTO } from './j_entries.entity';
import { J_entriesService } from './j_entries.service';
import { useLock } from 'src/shared/decorators/Lock.decorator';

@useLock()
@Controller('j_entries')
export class J_entriesController {
  constructor(private j_entriesService: J_entriesService) {}

  @Post('add')
  async create(@Body() createJ_entriesDTO: CreateJ_entriesDTO, @User('i') user_id: number) {
    const res = await this.j_entriesService.create(createJ_entriesDTO, user_id);
    return res;
  }

  @Get('getall')
  async findAll() {
    return await this.j_entriesService.getAll();
  }

  @Get('count')
  async count(): Promise<number> {
    let res = await this.findAll();
    return res.length;
  }

  // @Get()
  // findAll(@Query() query: ListAllEntities) {
  //   return `This action returns all cats (limit: ${query.limit} items)`;
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put('edit/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() bodyDTO: UpdateJ_entriesDTO, @User('i') user_id: number) {
    return await this.j_entriesService.update(id, bodyDTO, user_id);
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.j_entriesService.delete(id);
  }
}
