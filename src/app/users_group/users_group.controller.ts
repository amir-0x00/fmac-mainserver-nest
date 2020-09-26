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
import { CreateUsers_groupDTO, UpdateUsers_groupDTO } from './users_group.entity';
import { Users_groupService } from './users_group.service';
import { useLock } from 'src/shared/decorators/Lock.decorator';

@useLock()
@Controller('users_group')
export class Users_groupController {
  constructor(private users_groupService: Users_groupService) {}

  @Post('add')
  async create(@Body() createUsers_groupDTO: CreateUsers_groupDTO) {
    const res = await this.users_groupService.create(createUsers_groupDTO);
    return res;
  }

  @Get('getall')
  async findAll() {
    return await this.users_groupService.getAll();
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() bodyDTO: UpdateUsers_groupDTO) {
    return await this.users_groupService.update(id, bodyDTO);
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.users_groupService.delete(id);
  }
}
