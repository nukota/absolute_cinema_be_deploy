import { ApiProperty } from '@nestjs/swagger';
import { BookingHistoryDto } from './booking-history.dto';

export class UserProfileDto {
  @ApiProperty({
    description: 'Customer ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  customer_id: string;

  @ApiProperty({
    description: 'Full name',
    example: 'Nguyen Van A',
  })
  full_name: string;

  @ApiProperty({
    description: 'Email',
    example: 'nguyenvana@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '0901234567',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'Citizen Identification Number (CCCD)',
    example: '123456789012',
    required: false,
  })
  cccd?: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-01',
    required: false,
  })
  date_of_birth?: string;

  @ApiProperty({
    description: 'Member since (account creation date)',
    example: '2024-01-15T08:30:00',
  })
  member_since: string;

  @ApiProperty({
    description: 'Total number of bookings',
    example: 15,
  })
  total_bookings: number;

  @ApiProperty({
    description: 'Booking history',
    type: [BookingHistoryDto],
  })
  booking_history: BookingHistoryDto[];
}
