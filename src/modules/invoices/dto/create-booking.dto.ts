import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductItemDto {
  @ApiProperty({
    description: 'Product ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class TicketItemDto {
  @ApiProperty({
    description: 'Showtime ID (UUID)',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  showtime_id: string;

  @ApiProperty({
    description: 'Array of seat IDs (UUID)',
    example: ['789e0123-e89b-12d3-a456-426614174002', '789e0123-e89b-12d3-a456-426614174003'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  seats: string[];
}

export class CreateBookingDto {
  @ApiProperty({
    description: 'Customer ID (UUID)',
    example: 'abc12345-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  customer_id: string;

  @ApiProperty({
    description: 'Amount (can be deposit or full amount)',
    example: 150000,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'List of products to purchase',
    type: [ProductItemDto],
    example: [
      { product_id: '123e4567-e89b-12d3-a456-426614174000', quantity: 2 },
      { product_id: '123e4567-e89b-12d3-a456-426614174001', quantity: 1 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  products: ProductItemDto[];

  @ApiProperty({
    description: 'Ticket information with showtime and seats',
    type: TicketItemDto,
    example: {
      showtime_id: '456e7890-e89b-12d3-a456-426614174001',
      seats: ['789e0123-e89b-12d3-a456-426614174002', '789e0123-e89b-12d3-a456-426614174003'],
    },
  })
  @ValidateNested()
  @Type(() => TicketItemDto)
  @IsNotEmpty()
  tickets: TicketItemDto;

  @ApiProperty({
    description: 'Payment method',
    example: 'card',
    enum: ['card', 'momo', 'banking'],
  })
  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @ApiProperty({
    description: 'Total amount of the booking',
    example: 250000,
  })
  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @ApiProperty({
    description: 'Status of invoice',
    example: 'pending',
    enum: ['pending', 'completed', 'cancelled']
  })
  @IsString()
  status: string;
}
