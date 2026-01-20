import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVnpayPaymentDto {
  @ApiProperty({ example: 100000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'ORD123' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ example: 'Thanh toan don hang ORD123' })
  @IsString()
  @IsNotEmpty()
  orderInfo: string;
}
