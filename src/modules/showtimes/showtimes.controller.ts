import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimesDto } from './dto/create-showtimes.dto';
import { UpdateShowtimesDto } from './dto/update-showtimes.dto';
import { NotifyShowtimeDto } from './dto/notify-showtime.dto';
import { ShowtimeDto } from './dto/showtimes-response.dto';

@ApiTags('showtimes')
@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly service: ShowtimesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new showtime' })
  @ApiResponse({
    status: 201,
    description: 'The created showtime',
    type: ShowtimeDto,
  })
  create(@Body() dto: CreateShowtimesDto): Promise<ShowtimeDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all showtimes' })
  @ApiResponse({
    status: 200,
    description: 'List of all showtimes',
    type: [ShowtimeDto],
  })
  findAll(): Promise<ShowtimeDto[]> {
    return this.service.findAll();
  }

  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Get showtimes by movie ID within 7 days' })
  @ApiResponse({
    status: 200,
    description: 'List of showtimes for the movie in the next 7 days',
    type: [ShowtimeDto],
  })
  findByMovieId(@Param('movieId') movieId: string): Promise<ShowtimeDto[]> {
    return this.service.findByMovieId(movieId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get showtime by ID' })
  @ApiResponse({
    status: 200,
    description: 'The showtime details',
    type: ShowtimeDto,
  })
  findOne(@Param('id') id: string): Promise<ShowtimeDto> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a showtime' })
  update(@Param('id') id: string, @Body() dto: UpdateShowtimesDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a showtime' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('notify')
  @ApiOperation({
    summary: 'Notify users who saved a movie (provide showtime_id)',
  })
  async notify(@Body() body: NotifyShowtimeDto) {
    const { showtime_id } = body || ({} as NotifyShowtimeDto);
    if (!showtime_id) {
      return { message: 'showtime_id is required' };
    }

    return this.service.notifySavedUsers(showtime_id);
  }
}
