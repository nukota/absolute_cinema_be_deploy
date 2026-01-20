import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateRatingsDto } from './dto/create-ratings.dto';
import { UpdateRatingsDto } from './dto/update-ratings.dto';
import { RatingsResponseDto } from './dto/ratings-response.dto';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class RatingsService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) { }

  // CREATE
  async create(dto: CreateRatingsDto) {
    const rating = {
      rating_id: uuidv4(), // generate UUID
      ...dto,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('ratings')
      .insert(rating)
      .select();

    if (error) throw error;
    return data;
  }

  // READ ALL
  async findAll(): Promise<RatingsResponseDto[]> {
    const { data, error } = await this.supabase
      .from('ratings')
      .select(`
        *,
        customers(customer_id, full_name, email),
        movies(movie_id, title)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(rating => ({
      rating_id: rating.rating_id,
      customer: rating.customers,
      movie: rating.movies,
      rating_value: rating.rating_value,
      review: rating.review,
      created_at: rating.created_at,
    }));
  }

  // READ ONE
  async findOne(id: string): Promise<RatingsResponseDto> {
    const { data, error } = await this.supabase
      .from('ratings')
      .select(`
        *,
        customers(customer_id, full_name, email),
        movies(movie_id, title)
      `)
      .eq('rating_id', id)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundException(`Rating ${id} not found`);

    return {
      rating_id: data.rating_id,
      customer: data.customers,
      movie: data.movies,
      rating_value: data.rating_value,
      review: data.review,
      created_at: data.created_at,
    };
  }

  // UPDATE
  async update(id: string, dto: UpdateRatingsDto) {
    const { data, error } = await this.supabase
      .from('ratings')
      .update(dto)
      .eq('rating_id', id)
      .select();

    if (error) throw error;
    return data;
  }

  // DELETE
  async remove(id: string) {
    const { error } = await this.supabase
      .from('ratings')
      .delete()
      .eq('rating_id', id);

    if (error) throw error;
    return { message: `Rating ${id} deleted successfully` };
  }
}
