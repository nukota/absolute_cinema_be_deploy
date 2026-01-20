import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInvoice_productsDto {
  @ApiProperty({
    description: 'The ID of the invoice (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  invoice_id: string;

  @ApiProperty({
    description: 'The ID of the product (UUID)',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty({
    description: 'The quantity of the product in the invoice',
    example: '2',
  })
  @IsString()
  @IsNotEmpty()
  quantity: string;
}
