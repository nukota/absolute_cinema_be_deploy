import { PartialType } from '@nestjs/swagger';
import { CreateInvoice_productsDto } from './create-invoice_products.dto';

export class UpdateInvoice_productsDto extends PartialType(CreateInvoice_productsDto) {}
