import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CreateTreasuryDTO, UpdateTreasuryDTO } from './treasury.entity';
import { TreasuryService } from './treasury.service';

@Controller('treasury')
export class TreasuryController {
  constructor(private treasuryService: TreasuryService) {}

  @Post()
  async create(@Body() createTreasuryDTO: CreateTreasuryDTO | CreateTreasuryDTO[]) {
    return await this.treasuryService.create(createTreasuryDTO);
  }

  @Get()
  async findAll() {
    return await this.treasuryService.getAll();
  }

  // @Get()
  // findAll(@Query() query: ListAllEntities) {
  //   return `This action returns all cats (limit: ${query.limit} items)`;
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTreasuryDTO: UpdateTreasuryDTO) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
