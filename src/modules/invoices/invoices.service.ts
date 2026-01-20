import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateInvoicesDto } from './dto/update-invoices.dto';
import { InvoicesResponseDto } from './dto/invoices-response.dto';
import { SupabaseClient } from '@supabase/supabase-js';
import { BookingHistoryDto } from './dto/booking-history.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import {
  DashboardData,
  DailyData,
  GenreDistribution,
  TopMovie,
} from './dto/dashboard.dto';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InvoicesService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
    private readonly emailService: EmailService,
  ) { }

  private generateInvoiceCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createBooking(dto: CreateBookingDto): Promise<InvoicesResponseDto> {
    const startTime = Date.now();
    const invoiceId = uuidv4();
    const invoiceCode = this.generateInvoiceCode();

    try {
      console.log(`Starting booking process for invoice ${invoiceCode}`);

      // Parallel fetch for independent data
      const [showtimeResult, customerResult, existingTicketsResult] = await Promise.all([
        this.supabase
          .from('showtimes')
          .select('*, movies(title), rooms(name, cinemas(name, address))')
          .eq('showtime_id', dto.tickets.showtime_id)
          .single(),
        this.supabase
          .from('customers')
          .select('email, full_name')
          .eq('customer_id', dto.customer_id)
          .single(),
        this.supabase
          .from('tickets')
          .select('seat_id, seats(seat_label)')
          .eq('showtime_id', dto.tickets.showtime_id)
          .in('seat_id', dto.tickets.seats)
      ]);

      const { data: showtime, error: showtimeError } = showtimeResult;
      const { data: customer, error: customerError } = customerResult;
      const { data: existingTickets, error: ticketCheckError } = existingTicketsResult;

      if (showtimeError || !showtime) {
        throw new BadRequestException('Showtime not found');
      }
      if (customerError || !customer) {
        throw new BadRequestException('Customer not found');
      }
      if (ticketCheckError) throw ticketCheckError;
      if (existingTickets && existingTickets.length > 0) {
        throw new BadRequestException('Some seats are already booked');
      }

      console.log(`Fetched initial data in ${Date.now() - startTime}ms`);

      // Create invoice
      const newInvoice = {
        invoice_id: invoiceId,
        invoice_code: invoiceCode,
        customer_id: dto.customer_id,
        payment_method: dto.payment_method,
        status: dto.status || 'pending',
        total_amount: dto.total_amount,
        created_at: new Date().toISOString(),
      };

      const { data: invoice, error: invoiceError } = await this.supabase
        .from('invoices')
        .insert(newInvoice)
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create tickets and products in parallel
      const ticketsToCreate = dto.tickets.seats.map((seatId) => ({
        ticket_id: uuidv4(),
        invoice_id: invoiceId,
        showtime_id: dto.tickets.showtime_id,
        seat_id: seatId,
        price: showtime.price || 0,
        created_at: new Date().toISOString(),
      }));

      const insertPromises = [
        this.supabase.from('tickets').insert(ticketsToCreate)
      ];

      if (dto.products && dto.products.length > 0) {
        const invoiceProductsToCreate = dto.products.map((product) => ({
          invoice_id: invoiceId,
          product_id: product.product_id,
          quantity: product.quantity,
        }));
        insertPromises.push(this.supabase.from('invoice_products').insert(invoiceProductsToCreate));
      }

      const insertResults = await Promise.all(insertPromises);
      const ticketsError = insertResults[0].error;
      const productsError = insertResults[1]?.error;

      if (ticketsError) throw ticketsError;
      if (productsError) throw productsError;

      console.log(`Created invoice and related data in ${Date.now() - startTime}ms`);

      // Get full invoice response
      const fullInvoice = await this.findOne(invoiceId);

      // Parallel fetch for email data
      const seatsResult = await this.supabase
        .from('seats')
        .select('seat_id, seat_label')
        .in('seat_id', dto.tickets.seats);

      let productsResult: any = null;
      if (dto.products && dto.products.length > 0) {
        productsResult = await this.supabase
          .from('products')
          .select('product_id, name, price')
          .in('product_id', dto.products.map((p) => p.product_id));
      }

      const { data: seatsData, error: seatsError } = seatsResult;
      if (seatsError) throw seatsError;

      const seatLabelMap = new Map((seatsData || []).map((s) => [s.seat_id, s.seat_label]));
      const seatLabels = Array.from(seatLabelMap.values());

      let productDetails: Array<{ name: string; quantity: number; price: number }> = [];
      if (productsResult && productsResult.data) {
        const { data: products } = productsResult;
        productDetails = (products || []).map((p) => {
          const quantity = dto.products.find((item) => item.product_id === p.product_id)?.quantity || 1;
          return { name: p.name, quantity, price: p.price };
        });
      }

      console.log(`Fetched email data in ${Date.now() - startTime}ms`);

      // Send email asynchronously (don't wait for it to complete)
      const room = Array.isArray(showtime.rooms) ? showtime.rooms[0] : showtime.rooms;
      const cinema = Array.isArray(room?.cinemas) ? room.cinemas[0] : room?.cinemas;
      const movie = Array.isArray(showtime.movies) ? showtime.movies[0] : showtime.movies;

      this.emailService.sendBookingConfirmation(customer.email, {
        invoice_code: invoiceCode,
        movie_title: movie?.title || 'Unknown Movie',
        cinema_name: cinema?.name || 'Unknown Cinema',
        cinema_address: cinema?.address || 'Unknown Address',
        showtime: showtime.start_time,
        ticket_price: showtime.price || 0,
        seats: seatLabels,
        products: productDetails,
        total_amount: dto.total_amount,
        customer_name: customer.full_name,
      }).catch((emailError) => {
        console.warn('Failed to send confirmation email, but booking was successful:', emailError);
      });

      console.log(`Booking completed in ${Date.now() - startTime}ms`);
      return fullInvoice;
    } catch (error) {
      console.error(`Booking failed after ${Date.now() - startTime}ms:`, error.message);
      // Rollback: delete invoice if created
      await this.supabase.from('invoices').delete().eq('invoice_id', invoiceId);
      throw error;
    }
  }

  async findAll(): Promise<InvoicesResponseDto[]> {
    const { data, error } = await this.supabase
      .from('invoices')
      .select(
        `
      *,
      customers(customer_id, full_name, email),
      tickets(
        ticket_id,
        price,
        showtimes(
          start_time,
          movies(title)
        ),
        seats(seat_id, seat_label)
      ),
      invoice_products(
        quantity,
        products(product_id, name, price)
      )
    `,
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((invoice) => {
      const ticketsData =
        invoice?.tickets?.map((ticket) => ({
          title: ticket.showtimes?.movies?.title || 'Unknown Movie',
          showtime: ticket.showtimes?.start_time || null,
          price: ticket.price || 0,
          seat: ticket.seats
            ? Array.isArray(ticket.seats)
              ? ticket.seats.map((s) => s.seat_label)
              : [ticket.seats.seat_label]
            : [],
        })) || [];

      // Get first ticket's info and collect all seats
      const firstTicket = ticketsData[0];
      const allSeats = ticketsData.flatMap((t) => t.seat);

      const tickets = firstTicket
        ? {
          title: firstTicket.title,
          showtime: firstTicket.showtime,
          price: firstTicket.price,
          seats: allSeats,
        }
        : {
          title: 'Unknown Movie',
          showtime: null,
          price: 0,
          seats: [],
        };

      const products =
        invoice?.invoice_products?.map((ip) => ({
          product_id: ip.products?.product_id,
          name: ip.products?.name,
          quantity: ip.quantity,
          price: ip.products?.price || 0,
          total: ip.quantity * (ip.products?.price || 0),
        })) || [];

      const totalTickets = ticketsData.reduce(
        (sum, t) => sum + (t.price || 0),
        0,
      );
      const totalProducts = products.reduce(
        (sum, p) => sum + (p.total || 0),
        0,
      );
      const totalAmount = totalTickets + totalProducts;

      return {
        invoice_id: invoice.invoice_id,
        invoice_code: invoice.invoice_code,
        customer: invoice.customers,
        ticket_count: ticketsData.length,
        product_count: products.length,
        tickets,
        products,
        payment_method: invoice.payment_method,
        total_amount: totalAmount,
        status: invoice.status,
        created_at: invoice.created_at,
      };
    });
  }

  async findOne(id: string): Promise<InvoicesResponseDto> {
    const { data, error } = await this.supabase
      .from('invoices')
      .select(
        `
      *,
      customers(customer_id, full_name, email),
      tickets(
        ticket_id,
        price,
        showtimes(
          start_time,
          movies(title)
        ),
        seats(seat_id, seat_label)
      ),
      invoice_products(
        quantity,
        products(product_id, name, price)
      )
    `,
      )
      .eq('invoice_id', id)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundException(`Invoice ${id} not found`);

    const ticketsData =
      data?.tickets?.map((ticket) => ({
        title: ticket.showtimes?.movies?.title || 'Unknown Movie',
        showtime: ticket.showtimes?.start_time || null,
        price: ticket.price || 0,
        seat: ticket.seats
          ? Array.isArray(ticket.seats)
            ? ticket.seats.map((s) => s.seat_label)
            : [ticket.seats.seat_label]
          : [],
      })) || [];

    // Get first ticket's info and collect all seats
    const firstTicket = ticketsData[0];
    const allSeats = ticketsData.flatMap((t) => t.seat);

    const tickets = firstTicket
      ? {
        title: firstTicket.title,
        showtime: firstTicket.showtime,
        price: firstTicket.price,
        seats: allSeats,
      }
      : {
        title: 'Unknown Movie',
        showtime: null,
        price: 0,
        seats: [],
      };

    const products =
      data?.invoice_products?.map((ip) => ({
        product_id: ip.products?.product_id,
        name: ip.products?.name,
        quantity: ip.quantity,
        price: ip.products?.price || 0,
        total: ip.quantity * (ip.products?.price || 0),
      })) || [];

    const totalTickets = ticketsData.reduce(
      (sum, t) => sum + (t.price || 0),
      0,
    );
    const totalProducts = products.reduce((sum, p) => sum + (p.total || 0), 0);
    const totalAmount = totalTickets + totalProducts;

    return {
      invoice_id: data.invoice_id,
      invoice_code: data.invoice_code,
      customer: data.customers,
      ticket_count: ticketsData.length,
      product_count: products.length,
      tickets,
      products,
      payment_method: data.payment_method,
      total_amount: totalAmount,
      status: data.status,
      created_at: data.created_at,
    };
  }

  async update(id: string, dto: UpdateInvoicesDto) {
    const { data, error } = await this.supabase
      .from('invoices')
      .update(dto)
      .eq('invoice_id', id)
      .select();

    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .from('invoices')
      .delete()
      .eq('invoice_id', id);

    if (error) throw error;
    return { message: `Invoice with id ${id} deleted successfully` };
  }

  async getUserProfile(customerId: string): Promise<UserProfileDto> {
    // Get customer info
    const { data: customer, error: customerError } = await this.supabase
      .from('customers')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    if (customerError || !customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    // Get booking history from invoices
    const { data: invoices, error: invoicesError } = await this.supabase
      .from('invoices')
      .select(
        `
        invoice_id,
        created_at,
        status,
        total_amount,
        tickets(
          ticket_id,
          price,
          showtimes(
            start_time,
            movies(title),
            rooms(
              name,
              cinemas(name)
            )
          ),
          seats(seat_label)
        )
      `,
      )
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (invoicesError) {
      throw new Error(
        `Failed to fetch booking history: ${invoicesError.message}`,
      );
    }

    // Transform invoices to booking history
    const bookingHistory: BookingHistoryDto[] = (invoices || [])
      .filter((invoice) => invoice.tickets && invoice.tickets.length > 0)
      .map((invoice) => {
        const firstTicket = invoice.tickets[0];

        // Handle nested data structures
        const showtime = Array.isArray(firstTicket?.showtimes)
          ? firstTicket.showtimes[0]
          : firstTicket?.showtimes;
        const movie = Array.isArray(showtime?.movies)
          ? showtime.movies[0]
          : showtime?.movies;
        const room = Array.isArray(showtime?.rooms)
          ? showtime.rooms[0]
          : showtime?.rooms;
        const cinema = Array.isArray(room?.cinemas)
          ? room.cinemas[0]
          : room?.cinemas;

        const allSeats = invoice.tickets
          .map((t) => {
            const seat = Array.isArray(t.seats) ? t.seats[0] : t.seats;
            return seat?.seat_label;
          })
          .filter(Boolean);

        return {
          booking_id: invoice.invoice_id,
          movie_title: movie?.title || 'Unknown Movie',
          cinema_name: cinema?.name || 'Unknown Cinema',
          showtime: showtime?.start_time || '',
          seats: allSeats,
          total_price: invoice.total_amount || 0,
          status: this.mapInvoiceStatus(invoice.status),
          booking_time: invoice.created_at,
        };
      });

    return {
      customer_id: customer.customer_id,
      full_name: customer.full_name,
      email: customer.email,
      phone: customer.phone_number,
      cccd: customer.cccd,
      date_of_birth: customer.dob,
      member_since: customer.created_at,
      total_bookings: bookingHistory.length,
      booking_history: bookingHistory,
    };
  }

  /**
   * Get booking history only
   */
  async getBookingHistory(customerId: string): Promise<BookingHistoryDto[]> {
    const profile = await this.getUserProfile(customerId);
    return profile.booking_history;
  }

  /**
   * Map invoice status to booking status
   */
  private mapInvoiceStatus(
    invoiceStatus: string,
  ): 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' {
    const statusMap: Record<
      string,
      'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
    > = {
      pending: 'Pending',
      paid: 'Confirmed',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed',
      refunded: 'Cancelled',
    };

    return statusMap[invoiceStatus?.toLowerCase()] || 'Pending';
  }

  async getDashboardData(month?: string): Promise<DashboardData> {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const [year, monthNum] = targetMonth.split('-');

    if (!year || !monthNum) {
      throw new BadRequestException('Invalid month format. Use YYYY-MM');
    }

    const startDate = new Date(`${year}-${monthNum}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try {
      // 1. Get invoices for the month
      const { data: invoices, error: invoicesError } = await this.supabase
        .from('invoices')
        .select(
          `
          invoice_id,
          total_amount,
          created_at,
          customer_id,
          tickets(
            ticket_id,
            price,
            showtimes(
              movies(
                movie_id,
                title,
                genre
              )
            )
          )
        `,
        )
        .gte('created_at', startDate.toISOString())
        .lt('created_at', endDate.toISOString());

      if (invoicesError) throw invoicesError;

      // 2. Get total customers (all time)
      const { data: customers, error: customersError } = await this.supabase
        .from('customers')
        .select('customer_id');

      if (customersError) throw customersError;

      // 3. Get movies showing (with showtimes in next 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const { data: showtimes, error: showtimesError } = await this.supabase
        .from('showtimes')
        .select('movie_id')
        .gte('start_time', new Date().toISOString())
        .lt('start_time', thirtyDaysFromNow.toISOString());

      if (showtimesError) throw showtimesError;

      const uniqueMovies = new Set(showtimes?.map((s) => s.movie_id) || []);

      // Calculate stats
      const totalRevenue =
        invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
      const ticketsSold =
        invoices?.reduce((sum, inv) => sum + (inv.tickets?.length || 0), 0) ||
        0;

      // 4. Calculate daily data (every 2 days)
      const dailyData: DailyData[] = [];
      const currentDate = new Date(startDate);
      let dayCounter = 0;

      while (currentDate < endDate && dayCounter < 15) {
        const dayStart = new Date(currentDate);
        const dayEnd = new Date(currentDate);
        dayEnd.setDate(dayEnd.getDate() + 2);

        const dayInvoices =
          invoices?.filter((inv) => {
            const invDate = new Date(inv.created_at);
            return invDate >= dayStart && invDate < dayEnd;
          }) || [];

        const dayRevenue = dayInvoices.reduce(
          (sum, inv) => sum + (inv.total_amount || 0),
          0,
        );
        const dayTickets = dayInvoices.reduce(
          (sum, inv) => sum + (inv.tickets?.length || 0),
          0,
        );

        dailyData.push({
          date: dayStart.toISOString().slice(0, 10),
          revenue: dayRevenue,
          tickets: dayTickets,
        });

        currentDate.setDate(currentDate.getDate() + 2);
        dayCounter++;
      }

      // 5. Calculate genre distribution
      const genreMap = new Map<string, number>();
      invoices?.forEach((inv) => {
        inv.tickets?.forEach((ticket) => {
          const showtimes = Array.isArray(ticket.showtimes)
            ? ticket.showtimes[0]
            : ticket.showtimes;
          const movies = Array.isArray(showtimes?.movies)
            ? showtimes?.movies[0]
            : showtimes?.movies;
          const genres = movies?.genre;
          if (genres) {
            const genreList = Array.isArray(genres) ? genres : [genres];
            genreList.forEach((g) => {
              if (g) {
                genreMap.set(g, (genreMap.get(g) || 0) + 1);
              }
            });
          }
        });
      });

      const totalGenreTickets =
        Array.from(genreMap.values()).reduce((a, b) => a + b, 0) || 1;
      const genreDistribution: GenreDistribution[] = Array.from(
        genreMap.entries(),
      )
        .map(([genre, count]) => ({
          genre,
          percentage: Math.round((count / totalGenreTickets) * 100),
        }))
        .sort((a, b) => b.percentage - a.percentage);

      // 6. Get top movies
      const movieTicketMap = new Map<
        string,
        { title: string; count: number }
      >();
      invoices?.forEach((inv) => {
        inv.tickets?.forEach((ticket) => {
          const showtimes = Array.isArray(ticket.showtimes)
            ? ticket.showtimes[0]
            : ticket.showtimes;
          const movie = Array.isArray(showtimes?.movies)
            ? showtimes?.movies[0]
            : showtimes?.movies;
          if (movie?.movie_id) {
            const current = movieTicketMap.get(movie.movie_id) || {
              title: movie.title || 'Unknown',
              count: 0,
            };
            movieTicketMap.set(movie.movie_id, {
              title: movie.title || 'Unknown',
              count: current.count + 1,
            });
          }
        });
      });

      const topMovies: TopMovie[] = Array.from(movieTicketMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map((m) => ({
          movie_name: m.title,
          tickets_sold: m.count,
        }));

      return {
        stats: {
          total_revenue: totalRevenue,
          total_customers: customers?.length || 0,
          movies_showing: uniqueMovies.size,
          tickets_sold: ticketsSold,
        },
        daily_data: dailyData,
        genre_distribution: genreDistribution,
        top_movies: topMovies,
        month: targetMonth,
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard data: ${error.message}`);
    }
  }
}
