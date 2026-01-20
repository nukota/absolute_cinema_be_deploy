import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRatingsDto {
  @ApiProperty({
    description: 'Customer ID who made the rating (UUID)',
    example: 'd1e5b8c2-9a4d-4fcb-92c8-9a9f25ef1b3b',
  })
  @IsString()
  @IsNotEmpty()
  customer_id: string;

  @ApiProperty({
    description: 'Movie ID that the customer rated (UUID)',
    example: 'a7f2b3d1-92d4-4781-8b2b-1d9c14e3c76a',
  })
  @IsString()
  @IsNotEmpty()
  movie_id: string;

  @ApiProperty({
    description: 'Numeric rating value (from 1 to 5)',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  rating_value: number;

  @ApiProperty({
    description: 'Optional customer review about the movie',
    example: 'A great movie with stunning visuals and a solid storyline!',
  })
  @IsString()
  @IsNotEmpty()
  review: string;
}
