import { ApiProperty } from '@nestjs/swagger';

export class SeatsResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the seat',
    example: 'aa0d6c6f-b0b9-44d7-b213-7f6fa21f5c34',
  })
  seat_id: string;

  @ApiProperty({
    description: 'Room that this seat belongs to',
    example: {
      room_id: 'b67cdbb9-bf44-4f1c-8223-d8b6b0a214f7',
      name: 'Room A',
    },
  })
  room: {
    room_id: string;
    name: string;
  };

  @ApiProperty({
    description: 'Row number of the seat',
    example: 5,
  })
  row: number;

  @ApiProperty({
    description: 'Column number of the seat',
    example: 8,
  })
  col: number;

  @ApiProperty({
    description: 'Seat label (e.g., A5, B10)',
    example: 'A5',
  })
  seat_label: string;
}
