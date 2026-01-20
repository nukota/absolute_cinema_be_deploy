import { ApiProperty } from '@nestjs/swagger';

export class ProductsResponseDto {
  @ApiProperty()
  product_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  created_at: string;
}
