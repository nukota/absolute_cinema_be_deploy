import { PartialType } from '@nestjs/swagger';
import { CreateCinemasDto } from './create-cinemas.dto';

export class UpdateCinemasDto extends PartialType(CreateCinemasDto) {}
