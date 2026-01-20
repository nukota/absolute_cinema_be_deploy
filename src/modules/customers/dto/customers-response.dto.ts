import { ApiProperty } from '@nestjs/swagger';

export class CustomersResponseDto {
  @ApiProperty()
  customer_id: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  cccd: string;

  @ApiProperty()
  dob: Date;
}
