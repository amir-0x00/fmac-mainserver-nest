import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateConfigDTO, UpdateConfigDTO } from './config.entity';
import { ConfigService } from './config.service';
import { useLock } from 'src/shared/decorators/Lock.decorator';

@useLock()
@Controller('config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Post('add')
  async create(@Body() createConfigDTO: CreateConfigDTO) {
    const res = await this.configService.create(createConfigDTO);
    return res;
  }

  @Get('getall')
  async findAll() {
    return await this.configService.getAll();
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() bodyDTO: UpdateConfigDTO) {
    return await this.configService.update(id, bodyDTO);
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.configService.delete(id);
  }
}
