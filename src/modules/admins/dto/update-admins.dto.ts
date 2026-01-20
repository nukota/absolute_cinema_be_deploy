import { PartialType } from '@nestjs/swagger';
import { CreateAdminsDto } from './create-admins.dto';

export class UpdateAdminsDto extends PartialType(CreateAdminsDto) {}
