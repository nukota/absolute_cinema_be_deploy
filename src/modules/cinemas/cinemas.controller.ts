import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CreateCinemasDto } from './dto/create-cinemas.dto';
import { UpdateCinemasDto } from './dto/update-cinemas.dto';

@Controller('cinemas')
export class CinemasController {
  constructor(private readonly service: CinemasService) {}

  @Post()
  create(@Body() dto: CreateCinemasDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCinemasDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
