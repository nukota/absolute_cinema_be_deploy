import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMoviesDto } from './dto/create-movies.dto';
import { UpdateMoviesDto } from './dto/update-movies.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('movies')
export class MoviesController {
  constructor(private readonly service: MoviesService) {}

  @Post()
  create(@Body() dto: CreateMoviesDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('/customer')
  @ApiQuery({ name: 'customer_id', required: false, type: String })
  findAllByCustomerId(@Query('customer_id') customer_id?: string) {
    return this.service.findAllByCustomerId(customer_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('/slug/:slug')
  getMovieBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMoviesDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
