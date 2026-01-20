import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateInvoicesDto extends PartialType(CreateBookingDto) { }
