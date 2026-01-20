import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCinemasDto {
  @ApiProperty({
    description: 'Name of the cinema',
    example: 'CGV Landmark 81',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Address of the cinema',
    example: '208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  address: string;
}
