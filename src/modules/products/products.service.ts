import { Injectable } from '@nestjs/common';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) { }

  /** Create a new product */
  async create(dto: CreateProductsDto) {
    const product = {
      product_id: uuidv4(), // generate UUID
      ...dto,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase.from('products').insert(product).select();
    if (error) throw error;
    return data;
  }

  /** Get all products */
  async findAll() {
    const { data, error } = await this.supabase.from('products').select('*');
    if (error) throw error;
    return data;
  }

  /** Get one product by id */
  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('product_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /** Update a product */
  async update(id: string, dto: UpdateProductsDto) {
    const updateData: any = { ...dto };

    const { data, error } = await this.supabase
      .from('products')
      .update(updateData)
      .eq('product_id', id)
      .select();

    if (error) throw error;
    return data;
  }

  /** Remove a product */
  async remove(id: string) {
    const { data, error } = await this.supabase
      .from('products')
      .delete()
      .eq('product_id', id)
      .select();

    if (error) throw error;
    return { message: 'Deleted successfully' };
  }
}
