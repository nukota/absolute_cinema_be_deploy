import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { UpdateTicketsDto } from './dto/update-tickets.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly service: TicketsService) { }

  // @Post()
  // create(@Body() dto: CreateTicketsDto) {
  //   return this.service.create(dto);
  // }

  // @Get()
  // findAll() {
  //   return this.service.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.service.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateTicketsDto) {
  //   return this.service.update(id, dto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.service.remove(id);
  // }
}
