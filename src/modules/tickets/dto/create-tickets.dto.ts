import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTicketsDto {
  @ApiProperty({
    description: 'The ID of the showtime for this ticket',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  showtime_id: string;

  @ApiProperty({
    description: 'The ID of the invoice for this ticket',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  invoice_id: string;

  @ApiProperty({
    description: 'The ID of the seat for this ticket',
    example: '789e0123-e89b-12d3-a456-426614174002',
  })
  @IsString()
  @IsNotEmpty()
  seat_id: string;

  @ApiProperty({
    description: 'The price of the ticket',
    example: '10.00',
  })
  @IsString()
  @IsNotEmpty()
  price: string;
}
