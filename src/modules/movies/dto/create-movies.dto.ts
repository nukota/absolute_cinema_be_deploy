import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, IsJSON } from 'class-validator';

export class CreateMoviesDto {
  @ApiProperty({ example: 'Inception' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A mind-bending thriller by Christopher Nolan', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 148 })
  @IsNumber()
  @IsNotEmpty()
  duration_min: number;

  @ApiProperty({ example: '2010-07-16' })
  @IsDateString()
  @IsNotEmpty()
  release_date: string;

  @ApiProperty({ example: 'PG-13', required: false })
  @IsOptional()
  @IsString()
  rating?: string;

  @ApiProperty({ example: 'https://example.com/inception.jpg' })
  @IsString()
  @IsNotEmpty()
  poster_url: string;

  @ApiProperty({ example: 'https://example.com/inception-trailer.mp4', required: false })
  @IsOptional()
  @IsString()
  trailer_url?: string;

  @ApiProperty({ example: 'Christopher Nolan', required: false })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({
    example: [
      { name: 'Leonardo DiCaprio', role: 'Cobb' },
      { name: 'Joseph Gordon-Levitt', role: 'Arthur' },
    ],
    required: false,
  })
  @IsOptional()
  actors?: any; // JSON

  @ApiProperty({
    example: ['Action', 'Sci-Fi', 'Thriller'],
    required: false,
  })
  @IsOptional()
  genre?: any; // JSON
}
