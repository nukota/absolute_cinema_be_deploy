import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SavesService } from './saves.service';
import { CreateSavesDto } from './dto/create-saves.dto';

@Controller('saves')
export class SavesController {
  constructor(private readonly service: SavesService) { }

  @Post()
  create(@Body() dto: CreateSavesDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':customer_id')
  findOne(@Param('customer_id') customer_id: string) {
    return this.service.findOne(customer_id);
  }

  @Delete(':customer_id/:movie_id')
  remove(
    @Param('customer_id') customer_id: string,
    @Param('movie_id') movie_id: string,
  ) {
    return this.service.remove(customer_id, movie_id);
  }
}
