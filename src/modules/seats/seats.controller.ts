import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { CreateSeatsDto } from './dto/create-seats.dto';
import { UpdateSeatsDto } from './dto/update-seats.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly service: SeatsService) { }

  @Post()
  create(@Body() dto: CreateSeatsDto) {
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

  @Get('room/:room_id')
  findByRoomIdAndShowtime(@Param('room_id') roomId: string, @Query('showtime_id') showtimeId?: string) {
    return this.service.findByRoomIdAndShowtime(roomId, showtimeId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSeatsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
