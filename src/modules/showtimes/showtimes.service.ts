import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateShowtimesDto } from './dto/create-showtimes.dto';
import { UpdateShowtimesDto } from './dto/update-showtimes.dto';
import {
  ShowtimeDto,
  CinemaDto,
  RoomDto,
  MovieDto,
} from './dto/showtimes-response.dto';
import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/modules/email/email.service';

@Injectable()
export class ShowtimesService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
    private readonly emailService: EmailService,
  ) { }

  /**
   * Notify all users who saved `movieId` about a specific `showtimeId`.
   * Returns summary { total, sent, failed }
   */
  async notifySavedUsers(showtimeId: string) {
    if (!showtimeId) {
      throw new BadRequestException('showtimeId is required');
    }

    // fetch showtime info with movie title and cinema name in one query
    const { data: showtimeData, error: showtimeErr } = await this.supabase
      .from('showtimes')
      .select(`
        movie_id,
        start_time,
        movies(title),
        rooms(
          room_id,
          name,
          cinema_id,
          cinemas(name)
        )
      `)
      .eq('showtime_id', showtimeId)
      .single();

    if (showtimeErr) throw showtimeErr;
    if (!showtimeData) return { total: 0, sent: 0, failed: [] };

    const movieId = (showtimeData as any).movie_id;
    if (!movieId) return { total: 0, sent: 0, failed: [] };

    // fetch customers who saved this movie with their emails in one query
    const { data: savesWithCustomers, error: savesError } = await this.supabase
      .from('saves')
      .select(`
        customer_id,
        customers!inner(email, full_name)
      `)
      .eq('movie_id', movieId);

    if (savesError) throw savesError;
    if (!savesWithCustomers || savesWithCustomers.length === 0) {
      return { total: 0, sent: 0, failed: [] };
    }

    // extract unique emails
    const emailSet = new Set<string>();
    const customers = savesWithCustomers
      .map((s: any) => s.customers)
      .filter((c: any) => c && c.email)
      .filter((c: any) => {
        if (emailSet.has(c.email)) return false;
        emailSet.add(c.email);
        return true;
      });

    if (customers.length === 0) {
      return { total: savesWithCustomers.length, sent: 0, failed: [] };
    }

    const movieTitle = (showtimeData as any)?.movies?.title || '';
    const showtimeStr = showtimeData?.start_time || null;
    const cinemaName = (showtimeData as any)?.rooms?.cinemas?.name || undefined;

    // send emails in batches to avoid SMTP timeout
    const emails = customers.map((c: any) => c.email);
    const BATCH_SIZE = 5;
    const BATCH_DELAY = 500; // ms between batches
    const failed: string[] = [];
    let sent = 0;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((email) =>
          Promise.race([
            this.emailService.sendNewShowtimeNotification(email, {
              movie_title: movieTitle,
              showtime: showtimeStr,
              cinema_name: cinemaName,
            }),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error('Email send timeout')),
                8000, // 8 seconds per email
              ),
            ),
          ]),
        ),
      );

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          sent++;
        } else {
          failed.push(batch[index]);
        }
      });

      // delay between batches to prevent SMTP overload
      if (i + BATCH_SIZE < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
      }
    }

    return { total: emails.length, sent, failed };
  }

  async create(dto: CreateShowtimesDto): Promise<ShowtimeDto> {
    const newShowtime = {
      showtime_id: uuidv4(), // generate UUID
      ...dto,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('showtimes')
      .insert(newShowtime)
      .select();

    if (error) throw error;

    // Fetch the created showtime with joins
    return this.findOne(newShowtime.showtime_id);
  }

  // Get all showtimes
  async findAll(): Promise<ShowtimeDto[]> {
    const { data: showtimes, error: showtimeError } = await this.supabase
      .from('showtimes')
      .select('*, rooms(room_id, name, cinema_id), movies(movie_id, title)')
      .order('created_at', { ascending: false });

    if (showtimeError) throw showtimeError;

    const cinemaIds = [
      ...new Set(
        showtimes.map((s) => (s.rooms as any)?.cinema_id).filter(Boolean),
      ),
    ];

    const { data: cinemas, error: cinemaError } = await this.supabase
      .from('cinemas')
      .select('cinema_id, name, address')
      .in('cinema_id', cinemaIds);

    if (cinemaError) throw cinemaError;

    return showtimes.map((s) => {
      const dto = new ShowtimeDto();
      dto.showtime_id = s.showtime_id;
      dto.start_time = s.start_time;
      dto.end_time = s.end_time;
      dto.price = s.price;
      dto.created_at = s.created_at;

      const cinemaData = cinemas.find(
        (c) => c.cinema_id === (s.rooms as any)?.cinema_id,
      );
      if (cinemaData) {
        const cinema = new CinemaDto();
        cinema.cinema_id = cinemaData.cinema_id;
        cinema.name = cinemaData.name;
        cinema.address = cinemaData.address;
        dto.cinema = cinema;
      } else {
        dto.cinema = null;
      }

      const room = new RoomDto();
      room.room_id = (s.rooms as any)?.room_id;
      room.name = (s.rooms as any)?.name;
      dto.room = room;

      const movie = new MovieDto();
      movie.movie_id = (s.movies as any)?.movie_id;
      movie.title = (s.movies as any)?.title;
      dto.movie = movie;

      return dto;
    });
  }

  // Get a showtime by ID
  async findOne(id: string): Promise<ShowtimeDto> {
    const { data: showtimeData, error: showtimeError } = await this.supabase
      .from('showtimes')
      .select('*, rooms(room_id, name, cinema_id), movies(movie_id, title)')
      .eq('showtime_id', id)
      .single();

    if (showtimeError) throw showtimeError;
    if (!showtimeData) throw new NotFoundException(`Showtime ${id} not found`);

    const cinemaId =
      (showtimeData as any)?.rooms?.cinema_id ??
      (Array.isArray((showtimeData as any)?.rooms)
        ? (showtimeData as any).rooms[0]?.cinema_id
        : undefined);

    let cinema: CinemaDto | null = null;
    if (cinemaId) {
      const { data: cinemaData, error: cinemaError } = await this.supabase
        .from('cinemas')
        .select('cinema_id, name, address')
        .eq('cinema_id', cinemaId)
        .single();

      if (cinemaError) throw cinemaError;
      if (cinemaData) {
        cinema = new CinemaDto();
        cinema.cinema_id = cinemaData.cinema_id;
        cinema.name = cinemaData.name;
        cinema.address = cinemaData.address;
      }
    }

    const dto = new ShowtimeDto();
    dto.showtime_id = showtimeData.showtime_id;
    dto.start_time = showtimeData.start_time;
    dto.end_time = showtimeData.end_time;
    dto.price = showtimeData.price;
    dto.created_at = showtimeData.created_at;
    dto.cinema = cinema;

    const room = new RoomDto();
    room.room_id = (showtimeData as any)?.rooms?.room_id;
    room.name = (showtimeData as any)?.rooms?.name;
    dto.room = room;

    const movie = new MovieDto();
    movie.movie_id = (showtimeData as any)?.movies?.movie_id;
    movie.title = (showtimeData as any)?.movies?.title;
    dto.movie = movie;

    return dto;
  }

  // Update showtime
  async update(id: string, dto: UpdateShowtimesDto) {
    const { data, error } = await this.supabase
      .from('showtimes')
      .update(dto)
      .eq('showtime_id', id)
      .select();

    if (error) throw error;
    return data;
  }

  // Delete showtime
  async remove(id: string) {
    const { error } = await this.supabase
      .from('showtimes')
      .delete()
      .eq('showtime_id', id);

    if (error) throw error;
    return { message: `Showtime with id ${id} deleted successfully` };
  }

  // Get showtimes by movie_id within 7 days
  async findByMovieId(movieId: string): Promise<ShowtimeDto[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 8);

    const { data: showtimes, error: showtimeError } = await this.supabase
      .from('showtimes')
      .select('*, rooms(room_id, name, cinema_id), movies(movie_id, title)')
      .eq('movie_id', movieId)
      .gte('start_time', today.toISOString())
      .lte('start_time', sevenDaysFromNow.toISOString())
      .order('start_time', { ascending: true });

    if (showtimeError) throw showtimeError;

    if (!showtimes || showtimes.length === 0) {
      return [];
    }

    const cinemaIds = [
      ...new Set(showtimes.map((s) => s.rooms?.cinema_id).filter(Boolean)),
    ];

    const { data: cinemas, error: cinemaError } = await this.supabase
      .from('cinemas')
      .select('cinema_id, name, address')
      .in('cinema_id', cinemaIds);

    if (cinemaError) throw cinemaError;

    const result = showtimes.map((s) => {
      const dto = new ShowtimeDto();
      dto.showtime_id = s.showtime_id;
      dto.start_time = s.start_time;
      dto.end_time = s.end_time;
      dto.price = s.price;
      dto.created_at = s.created_at;

      const cinemaData = cinemas.find(
        (c) => c.cinema_id === s.rooms?.cinema_id,
      );
      if (cinemaData) {
        const cinema = new CinemaDto();
        cinema.cinema_id = cinemaData.cinema_id;
        cinema.name = cinemaData.name;
        cinema.address = cinemaData.address;
        dto.cinema = cinema;
      } else {
        dto.cinema = null;
      }

      const room = new RoomDto();
      room.room_id = s.rooms?.room_id;
      room.name = s.rooms?.name;
      dto.room = room;

      const movie = new MovieDto();
      movie.movie_id = s.movies?.movie_id;
      movie.title = s.movies?.title;
      dto.movie = movie;

      return dto;
    });

    return result;
  }
}
