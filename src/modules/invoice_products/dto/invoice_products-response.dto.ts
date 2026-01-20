import { ApiProperty } from '@nestjs/swagger';

export class Invoice_productsResponseDto {
  @ApiProperty()
  invoice_id: string;

  @ApiProperty()
  product_id: string;

  @ApiProperty()
  quantity: string;
}
