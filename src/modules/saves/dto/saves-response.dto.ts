import { ApiProperty } from '@nestjs/swagger';

export class SavesResponseDto {
  @ApiProperty()
  customer_id: string;

  @ApiProperty()
  movie_id: string;

  @ApiProperty()
  created_at: string;
}
