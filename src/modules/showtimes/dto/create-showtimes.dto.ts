import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShowtimesDto {
  @ApiProperty({
    description: 'The ID of the movie being shown (references the movies table)',
    example: '9710749c-1b1c-4139-b81e-918c0c0c86dd',
  })
  @IsString()
  @IsNotEmpty()
  movie_id: string;

  @ApiProperty({
    description: 'The ID of the room where the movie will be screened (references the rooms table)',
    example: '9710749c-1b1c-4139-ae23-918c0c0c86dd',
  })
  @IsString()
  @IsNotEmpty()
  room_id: string;

  @ApiProperty({
    description: 'Start time of the movie (ISO 8601 format)',
    example: '2025-11-01T19:30:00Z',
  })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({
    description: 'End time of the movie (ISO 8601 format)',
    example: '2025-11-01T21:45:00Z',
  })
  @IsString()
  @IsNotEmpty()
  end_time: string;

  @ApiProperty({
    description: 'Ticket price for this showtime (in VND)',
    example: '120000',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
