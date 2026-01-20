import { PartialType } from '@nestjs/swagger';
import { CreateTicketsDto } from './create-tickets.dto';

export class UpdateTicketsDto extends PartialType(CreateTicketsDto) {}
