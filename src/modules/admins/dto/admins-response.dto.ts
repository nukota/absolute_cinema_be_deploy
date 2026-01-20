import { ApiProperty } from '@nestjs/swagger';

export class AdminsResponseDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  created_at: string;
}
