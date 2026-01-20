import { Injectable, Inject } from '@nestjs/common';
import { CreateSavesDto } from './dto/create-saves.dto';
import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SavesService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) { }

  // CREATE
  async create(dto: CreateSavesDto) {
    const save = {
      ...dto,
      created_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('saves')
      .insert(save)
      .select();

    if (error) throw error;
    return data;
  }

  // GET ALL
  async findAll() {
    const { data, error } = await this.supabase
      .from('saves')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // GET ONE User
  async findOne(customer_id: string) {
    const { data, error } = await this.supabase
      .from('saves')
      .select('*')
      .eq('customer_id', customer_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // DELETE
  async remove(customer_id: string, movie_id: string) {
    const { error } = await this.supabase
      .from('saves')
      .delete()
      .eq('customer_id', customer_id)
      .eq('movie_id', movie_id);

    if (error) throw error;
    return { message: `Save record for customer ${customer_id} and movie ${movie_id} deleted successfully` };
  }
}
