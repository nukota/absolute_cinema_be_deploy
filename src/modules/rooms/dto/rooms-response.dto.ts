import { ApiProperty } from '@nestjs/swagger';

export class RoomsResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the room',
    example: 'b4e9fadc-1a23-4f3c-b29d-2f30c1234567',
  })
  room_id: string;

  @ApiProperty({
    description: 'Cinema that this room belongs to',
    example: {
      cinema_id: '9d67a44e-2f6a-4b47-8f6b-44e88922c111',
      name: 'CGV Landmark 81',
    },
  })
  cinema: {
    cinema_id: string;
    name: string;
  };

  @ApiProperty({
    description: 'Name of the room',
    example: 'Room A',
    maxLength: 255,
  })
  name: string;

  @ApiProperty({
    description: 'Capacity (number of seats) in the room',
    example: 120,
  })
  capacity: number;

  @ApiProperty({
    description: 'Timestamp when the room was created',
    example: '2025-11-03T10:20:30.000Z',
    required: false,
  })
  created_at?: string;
}
