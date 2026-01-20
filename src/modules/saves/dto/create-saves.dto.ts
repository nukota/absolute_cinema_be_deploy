import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSavesDto {
  @ApiProperty({
    description: 'Customer ID who made the save (UUID)',
    example: 'd1e5b8c2-9a4d-4fcb-92c8-9a9f25ef1b3b',
  })
  @IsString()
  @IsNotEmpty()
  customer_id: string;

  @ApiProperty({
    description: 'Movie ID which user save (UUID)',
    example: 'd1e5b8c2-9a4d-4fcb-92c8-9a9f25ef1b3b',
  })
  @IsString()
  @IsNotEmpty()
  movie_id: string;
}
