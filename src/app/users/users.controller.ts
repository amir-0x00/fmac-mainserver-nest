import { sleep } from 'src/utils/utils';
import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateUsersDTO, UpdateUsersDTO } from './users.entity';
import { UsersService } from './users.service';
import { useLock } from 'src/shared/decorators/Lock.decorator';
import { User } from 'src/shared/decorators/User.decorator';

@useLock()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('add')
  async create(@Body() createUsersDTO: CreateUsersDTO) {
    const res = await this.usersService.create(createUsersDTO);
    return res;
  }

  @Get('getall')
  async findAll(@User() usr?) {
    // console.log('usr', usr);
    return await this.usersService.getAll();
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() bodyDTO: UpdateUsersDTO) {
    return await this.usersService.update(id, bodyDTO);
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.delete(id);
  }
}
