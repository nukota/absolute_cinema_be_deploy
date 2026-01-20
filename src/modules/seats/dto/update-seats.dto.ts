import { PartialType } from '@nestjs/swagger';
import { CreateSeatsDto } from './create-seats.dto';

export class UpdateSeatsDto extends PartialType(CreateSeatsDto) {}
