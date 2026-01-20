import { ApiProperty } from '@nestjs/swagger';

export class CinemaDto {
  @ApiProperty()
  cinema_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  address?: string;
}

export class RoomDto {
  @ApiProperty()
  room_id: string;

  @ApiProperty()
  name: string;
}

export class MovieDto {
  @ApiProperty()
  movie_id: string;

  @ApiProperty()
  title: string;
}

export class ShowtimeDto {
  @ApiProperty()
  showtime_id: string;

  @ApiProperty({ type: () => CinemaDto, nullable: true })
  cinema: CinemaDto | null;

  @ApiProperty({ type: () => RoomDto })
  room: RoomDto;

  @ApiProperty({ type: () => MovieDto })
  movie: MovieDto;

  @ApiProperty()
  start_time: string;

  @ApiProperty()
  end_time: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  created_at?: string;
}
