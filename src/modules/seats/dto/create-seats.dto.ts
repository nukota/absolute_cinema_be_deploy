import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateSeatsDto {
  @ApiProperty({
    description: 'UUID of the room this seat belongs to',
    example: '7e61dcf4-3db9-4f22-bb62-5f44a6eb7a4e',
  })
  @IsUUID()
  @IsNotEmpty()
  room_id: string;

  @ApiProperty({
    description: 'Row number of the seat',
    example: 5,
  })
  @IsInt()
  @Min(1)
  row: number;

  @ApiProperty({
    description: 'Column number of the seat',
    example: 8,
  })
  @IsInt()
  @Min(1)
  col: number;

  @ApiProperty({
    description: 'Seat label (e.g., A5, B10)',
    example: 'A5',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  seat_label: string;
}
