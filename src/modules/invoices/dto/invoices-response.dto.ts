import { ApiProperty } from '@nestjs/swagger';

class CustomerDto {
  @ApiProperty()
  customer_id: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  email: string;
}

class TicketDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  showtime: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ type: [String] })
  seats: string[];
}

class ProductDto {
  @ApiProperty()
  product_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  total: number;
}

export class InvoicesResponseDto {
  @ApiProperty()
  invoice_id: string;

  @ApiProperty()
  invoice_code: string;

  @ApiProperty({ type: () => CustomerDto })
  customer: CustomerDto;

  @ApiProperty()
  ticket_count: number;

  @ApiProperty()
  product_count: number;

  @ApiProperty({ type: () => TicketDto })
  tickets: TicketDto;

  @ApiProperty({ type: [ProductDto] })
  products: ProductDto[];

  @ApiProperty()
  payment_method: string;

  @ApiProperty()
  total_amount: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  created_at: string;
}
