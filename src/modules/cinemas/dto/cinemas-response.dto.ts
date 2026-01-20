import { ApiProperty } from '@nestjs/swagger';

export class CinemasResponseDto {
  @ApiProperty()
  cinema_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  room_count: number;
}
