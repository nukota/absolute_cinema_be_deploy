import { ApiProperty } from '@nestjs/swagger';

export class TicketsResponseDto {
  @ApiProperty()
  ticket_id: string;

  @ApiProperty()
  showtime_id: string;

  @ApiProperty()
  invoice_id: string;

  @ApiProperty()
  seat_id: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  created_at: string;
}
