import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { Invoice_productsService } from './invoice_products.service';
import { CreateInvoice_productsDto } from './dto/create-invoice_products.dto';
import { UpdateInvoice_productsDto } from './dto/update-invoice_products.dto';
import { isValidDate } from 'rxjs/internal/util/isDate';

@Controller('invoice_products')
export class Invoice_productsController {
  constructor(private readonly service: Invoice_productsService) { }

  // @Post()
  // create(@Body() dto: CreateInvoice_productsDto) {
  //   return this.service.create(dto);
  // }

  // @Get()
  // findAll() {
  //   return this.service.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.service.findOne(id);
  // }

  // @Delete(':invoice_id/:product_id')
  // remove(
  //   @Param('invoice_id') invoice_id: string,
  //   @Param('product_id') product_id: string) {
  //   return this.service.remove(invoice_id, product_id);
  // }
}
