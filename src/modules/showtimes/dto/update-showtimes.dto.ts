import { PartialType } from '@nestjs/swagger';
import { CreateShowtimesDto } from './create-showtimes.dto';

export class UpdateShowtimesDto extends PartialType(CreateShowtimesDto) {}
