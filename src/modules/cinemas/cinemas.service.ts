import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateCinemasDto } from './dto/create-cinemas.dto';
import { UpdateCinemasDto } from './dto/update-cinemas.dto';
import { CinemasResponseDto } from './dto/cinemas-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CinemasService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  /**
   * Create a new cinema
   */
  async create(dto: CreateCinemasDto): Promise<CinemasResponseDto> {
    const newCinema = {
      cinema_id: uuidv4(),
      name: dto.name,
      address: dto.address,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('cinemas')
      .insert(newCinema)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to create cinema: ${error.message}`,
      );
    }

    // Get room count for this cinema
    const roomCount = await this.getRoomCount(data.cinema_id);
    return { ...data, room_count: roomCount };
  }

  /**
   * Get all cinemas with room count
   */
  async findAll(): Promise<CinemasResponseDto[]> {
    const { data, error } = await this.supabase
      .from('cinemas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to fetch cinemas: ${error.message}`,
      );
    }

    // Get room count for each cinema
    const cinemasWithRoomCount = await Promise.all(
      (data || []).map(async (cinema) => {
        const roomCount = await this.getRoomCount(cinema.cinema_id);
        return { ...cinema, room_count: roomCount };
      }),
    );

    return cinemasWithRoomCount;
  }

  /**
   * Get a single cinema by ID
   */
  async findOne(id: string): Promise<CinemasResponseDto> {
    const { data, error } = await this.supabase
      .from('cinemas')
      .select('*')
      .eq('cinema_id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Cinema with ID ${id} not found`);
    }

    // Get room count for this cinema
    const roomCount = await this.getRoomCount(data.cinema_id);
    return { ...data, room_count: roomCount };
  }

  /**
   * Update a cinema by ID
   */
  async update(id: string, dto: UpdateCinemasDto): Promise<CinemasResponseDto> {
    // First check if cinema exists
    await this.findOne(id);

    const updateData: any = { ...dto };

    const { data, error } = await this.supabase
      .from('cinemas')
      .update(updateData)
      .eq('cinema_id', id)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to update cinema: ${error.message}`,
      );
    }

    // Get room count for this cinema
    const roomCount = await this.getRoomCount(data.cinema_id);
    return { ...data, room_count: roomCount };
  }

  /**
   * Delete a cinema by ID
   */
  async remove(id: string): Promise<{ message: string }> {
    // First check if cinema exists
    await this.findOne(id);

    const { error } = await this.supabase
      .from('cinemas')
      .delete()
      .eq('cinema_id', id);

    if (error) {
      throw new InternalServerErrorException(
        `Failed to delete cinema: ${error.message}`,
      );
    }

    return {
      message: `Cinema with ID ${id} has been deleted successfully`,
    };
  }

  /**
   * Helper method to get room count for a cinema
   */
  private async getRoomCount(cinemaId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('cinema_id', cinemaId);

    if (error) {
      console.error(`Error counting rooms for cinema ${cinemaId}:`, error);
      return 0;
    }

    return count || 0;
  }
}
