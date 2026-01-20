import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NotifyShowtimeDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsString()
  showtime_id: string;
}