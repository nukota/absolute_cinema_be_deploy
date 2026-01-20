import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { CreateRoomsDto } from './dto/create-rooms.dto';
import { UpdateRoomsDto } from './dto/update-rooms.dto';
import { RoomsResponseDto } from './dto/rooms-response.dto';
import { Seats } from '../seats/entities/seats.entity';

@Injectable()
export class RoomsService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  /**
   * Create a new room
   */
  async create(dto: CreateRoomsDto): Promise<RoomsResponseDto> {
    const capacityroom = dto.seats.length;

    const newRoom = {
      room_id: uuidv4(),
      cinema_id: dto.cinema_id,
      name: dto.name,
      capacity: capacityroom,
      created_at: new Date().toISOString(),
    };

    const newSeats = dto.seats.map((seat) => ({
      seat_id: uuidv4(),
      room_id: newRoom.room_id, // liên kết ghế với phòng này
      row: seat.row,
      col: seat.col,
      seat_label: seat.seat_label,
    }));

    // Check if the cinema exists
    const { data: cinemaData, error: cinemaError } = await this.supabase
      .from('cinemas')
      .select('cinema_id, name')
      .eq('cinema_id', dto.cinema_id)
      .single();

    if (cinemaError || !cinemaData) {
      throw new NotFoundException(`Cinema with ID ${dto.cinema_id} not found`);
    }

    try {
      // 1️⃣ Tạo room
      const { data: roomData, error: roomError } = await this.supabase
        .from('rooms')
        .insert(newRoom)
        .select('*')
        .single();

      if (roomError) {
        throw new InternalServerErrorException(
          `Lỗi khi tạo room: ${roomError.message}`,
        );
      }

      // 2️⃣ Tạo seats
      const { data: seatsData, error: seatsError } = await this.supabase
        .from('seats')
        .insert(newSeats)
        .select('*');

      if (seatsError) {
        // Nếu lỗi khi tạo seats → rollback (xóa room vừa tạo)
        await this.supabase
          .from('rooms')
          .delete()
          .eq('room_id', newRoom.room_id);
        throw new Error(`Lỗi khi tạo seats: ${seatsError.message}`);
      }

      return {
        room_id: roomData.room_id,
        cinema: {
          cinema_id: cinemaData.cinema_id,
          name: cinemaData.name,
        },
        name: roomData.name,
        capacity: newSeats.length,
        created_at: roomData.created_at,
      };
    } catch (err) {
      console.error('❌ Lỗi khi tạo room và seats:', err.message);
      throw new InternalServerErrorException(
        'Không thể tạo phòng chiếu và ghế!',
      );
    }
  }
  /**
   * Get all rooms with their cinema info
   */
  async findAll(): Promise<RoomsResponseDto[]> {
    const { data: rooms, error } = await this.supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to fetch rooms: ${error.message}`,
      );
    }

    const results: RoomsResponseDto[] = [];

    for (const room of rooms || []) {
      const cinema = await this.getCinemaInfo(room.cinema_id);
      results.push({
        ...room,
        cinema,
      });
    }

    return results;
  }

  /**
   * Get a single room by ID
   */
  async findOne(id: string): Promise<RoomsResponseDto> {
    const { data, error } = await this.supabase
      .from('rooms')
      .select('*')
      .eq('room_id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    const cinema = await this.getCinemaInfo(data.cinema_id);
    return { ...data, cinema };
  }

  /**
   * Update a room by ID
   */
  async update(id: string, dto: UpdateRoomsDto): Promise<RoomsResponseDto> {
    // 1️⃣ Lấy thông tin room cũ
    const { data: roomData, error: roomError } = await this.supabase
      .from('rooms')
      .select('*')
      .eq('room_id', id)
      .single();

    if (roomError || !roomData) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    // 2️⃣ Update name nếu có
    if (dto.name) {
      const { error: nameError } = await this.supabase
        .from('rooms')
        .update({ name: dto.name })
        .eq('room_id', id);

      if (nameError) {
        throw new HttpException(
          { message: `Không thể update tên phòng: ${nameError.message}` },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    let seatsCount = 0;
    let newSeats;
    // 3️⃣ Update seats nếu có
    if (dto.seats) {
      try {
        // Xóa seats cũ
        const { error: deleteError } = await this.supabase
          .from('seats')
          .delete()
          .eq('room_id', id);

        if (deleteError) {
          throw new Error(`Xóa seats cũ thất bại: ${deleteError.message}`);
        }

        // Tạo seats mới
        newSeats = dto.seats.map((seat) => ({
          seat_id: uuidv4(),
          room_id: id,
          row: seat.row,
          col: seat.col,
          seat_label: seat.seat_label,
        }));

        const { error: insertError } = await this.supabase
          .from('seats')
          .insert(newSeats);

        if (insertError) {
          throw new Error(`Tạo seats mới thất bại: ${insertError.message}`);
        }

        seatsCount = newSeats.length;
      } catch (err) {
        console.error('❌ Lỗi khi update seats:', err.message);
        throw new HttpException(
          { message: 'Không thể update seats!' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      // Nếu không update seats -> lấy số lượng seats hiện tại
      const { data: existingSeats } = await this.supabase
        .from('seats')
        .select('seat_id')
        .eq('room_id', id);

      seatsCount = existingSeats?.length || 0;
      newSeats = existingSeats || [];
    }

    // 4️⃣ Lấy cinema info
    const { data: cinemaData, error: cinemaError } = await this.supabase
      .from('cinemas')
      .select('cinema_id, name')
      .eq('cinema_id', roomData.cinema_id)
      .single();

    if (cinemaError || !cinemaData) {
      throw new NotFoundException(
        `Cinema with ID ${roomData.cinema_id} not found`,
      );
    }

    // 5️⃣ Trả về RoomDTO chuẩn format bạn muốn
    return {
      room_id: roomData.room_id,
      cinema: {
        cinema_id: cinemaData.cinema_id,
        name: cinemaData.name,
      },
      name: dto.name || roomData.name,
      capacity: seatsCount,
      created_at: roomData.created_at,
    };
  }

  /**
   * Delete a room by ID
   */
  async remove(id: string): Promise<{ message: string }> {
    // Check if room exists
    await this.findOne(id);

    const { error } = await this.supabase
      .from('rooms')
      .delete()
      .eq('room_id', id);

    if (error) {
      throw new InternalServerErrorException(
        `Failed to delete room: ${error.message}`,
      );
    }

    return { message: `Room with ID ${id} has been deleted successfully` };
  }

  /**
   * Helper method: Get cinema info for a room
   */
  private async getCinemaInfo(cinemaId: string): Promise<{
    cinema_id: string;
    name: string;
  }> {
    const { data, error } = await this.supabase
      .from('cinemas')
      .select('cinema_id, name')
      .eq('cinema_id', cinemaId)
      .single();

    if (error || !data) {
      return { cinema_id: cinemaId, name: 'Unknown Cinema' };
    }

    return data;
  }
}
