import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsInt } from 'class-validator';

class SeatDto {
  @ApiProperty({ example: 1, description: 'Số hàng của ghế' })
  @IsInt()
  row: number;

  @ApiProperty({ example: 5, description: 'Số cột của ghế' })
  @IsInt()
  col: number;

  @ApiProperty({ example: 'A5', description: 'Nhãn ghế hiển thị cho người dùng' })
  @IsString()
  @IsNotEmpty()
  seat_label: string;
}

export class CreateRoomsDto {
  @ApiProperty({ example: 'uuid-of-cinema', description: 'ID của rạp chiếu phim (cinema)' })
  @IsString()
  @IsNotEmpty()
  cinema_id: string;

  @ApiProperty({ example: 'Phòng chiếu 1', description: 'Tên của phòng chiếu' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Danh sách các ghế trong phòng',
    type: [SeatDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];
}
