import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateInvoice_productsDto } from './dto/create-invoice_products.dto';
import { UpdateInvoice_productsDto } from './dto/update-invoice_products.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class Invoice_productsService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) { }

  async create(dto: CreateInvoice_productsDto) {

    const { data, error } = await this.supabase
      .from('invoice_products')
      .insert(dto)
      .select();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('invoice_products')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('invoice_products')
      .select('*')
      .eq('invoice_id', id);

    if (error) throw error;
    if (!data || data.length === 0) throw new NotFoundException(`Invoice product ${id} not found`);
    return data;
  }

  async remove(invoice_id: string) {
    const { error } = await this.supabase
      .from('invoice_products')
      .delete()
      .eq('invoice_id', invoice_id);

    if (error) throw error;
    return { message: `Invoice product deleted successfully` };
  }
}
