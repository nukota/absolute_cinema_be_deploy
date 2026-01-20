import { ApiProperty } from '@nestjs/swagger';

class CustomerDto {
  @ApiProperty()
  customer_id: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  email: string;
}

class MovieDto {
  @ApiProperty()
  movie_id: string;

  @ApiProperty()
  title: string;
}

export class RatingsResponseDto {
  @ApiProperty()
  rating_id: string;

  @ApiProperty({ type: () => CustomerDto })
  customer: CustomerDto;

  @ApiProperty({ type: () => MovieDto })
  movie: MovieDto;

  @ApiProperty()
  rating_value: number;

  @ApiProperty({ required: false })
  review?: string;

  @ApiProperty({ required: false })
  created_at?: string;
}
