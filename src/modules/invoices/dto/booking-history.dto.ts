import { ApiProperty } from '@nestjs/swagger';

export class BookingHistoryDto {
  @ApiProperty({
    description: 'Booking ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  booking_id: string;

  @ApiProperty({
    description: 'Movie title',
    example: 'Avengers: Endgame',
  })
  movie_title: string;

  @ApiProperty({
    description: 'Cinema name',
    example: 'CGV Vincom',
  })
  cinema_name: string;

  @ApiProperty({
    description: 'Showtime',
    example: '2025-11-07T19:30:00',
  })
  showtime: string;

  @ApiProperty({
    description: 'List of seat labels',
    example: ['A1', 'A2'],
    type: [String],
  })
  seats: string[];

  @ApiProperty({
    description: 'Total price',
    example: 240000,
  })
  total_price: number;

  @ApiProperty({
    description: 'Booking status',
    example: 'Confirmed',
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
  })
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

  @ApiProperty({
    description: 'Booking time',
    example: '2025-11-07T10:30:00',
  })
  booking_time: string;
}