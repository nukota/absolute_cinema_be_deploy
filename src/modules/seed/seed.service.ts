import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CustomersService } from '../customers/customers.service';
import { CinemasService } from '../cinemas/cinemas.service';
import { RoomsService } from '../rooms/rooms.service';
import { MoviesService } from '../movies/movies.service';
import { ProductsService } from '../products/products.service';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { TicketsService } from '../tickets/tickets.service';
import { Invoice_productsService } from '../invoice_products/invoice_products.service';
import { SavesService } from '../saves/saves.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SeedService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
    private readonly customersService: CustomersService,
    private readonly cinemasService: CinemasService,
    private readonly roomsService: RoomsService,
    private readonly moviesService: MoviesService,
    private readonly productsService: ProductsService,
    private readonly showtimesService: ShowtimesService,
    private readonly ticketsService: TicketsService,
    private readonly invoiceProductsService: Invoice_productsService,
    private readonly savesService: SavesService,
  ) {}

  async seed() {
    try {
      // Create admin auth account
      console.log('Creating admin auth account...');
      const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
        email: process.env.SEED_ADMIN_EMAIL,
        password: process.env.SEED_ADMIN_PASSWORD,
        user_metadata: {
          full_name: process.env.SEED_ADMIN_NAME,
        },
        email_confirm: true, // Auto-confirm the email
      });

      if (authError) {
        console.error('Error creating admin auth account:', authError);
        throw authError;
      }

      // Insert admin record in admins table
      const { error: adminInsertError } = await this.supabase
        .from('admins')
        .insert({
          user_id: authData.user?.id,
          full_name: process.env.SEED_ADMIN_NAME,
          email: process.env.SEED_ADMIN_EMAIL,
          created_at: new Date().toISOString(),
        });

      if (adminInsertError) {
        console.error('Error inserting admin record:', adminInsertError);
        throw adminInsertError;
      }

      // Create customer auth account
      console.log('Creating customer auth account...');
      const { data: customerAuthData, error: customerAuthError } = await this.supabase.auth.admin.createUser({
        email: process.env.SEED_CUSTOMER_EMAIL,
        password: process.env.SEED_CUSTOMER_PASSWORD,
        user_metadata: {
          full_name: process.env.SEED_CUSTOMER_NAME,
        },
        email_confirm: true, // Auto-confirm the email
      });

      if (customerAuthError) {
        console.error('Error creating customer auth account:', customerAuthError);
        throw customerAuthError;
      }

      // Insert seeded customer record in customers table
      const { error: customerInsertError } = await this.supabase
        .from('customers')
        .insert({
          customer_id: customerAuthData.user?.id,
          full_name: process.env.SEED_CUSTOMER_NAME,
          email: process.env.SEED_CUSTOMER_EMAIL,
          phone_number: '0123456789', // dummy phone
          cccd: '123456789012', // dummy cccd
          dob: new Date('1990-01-01'), // dummy dob
          created_at: new Date().toISOString(),
        });

      if (customerInsertError) {
        console.error('Error inserting seeded customer record:', customerInsertError);
        throw customerInsertError;
      }

      // Seed customers (10 customers)
      const customerDtos = [
        {
          full_name: 'Nguyen Van A',
          email: 'customer1@example.com',
          phone_number: '0123456789',
          created_at: new Date().toISOString(),
          cccd: '123456789012',
          dob: new Date('1990-01-01'),
        },
        {
          full_name: 'Tran Thi B',
          email: 'customer2@example.com',
          phone_number: '0987654321',
          created_at: new Date().toISOString(),
          cccd: '987654321098',
          dob: new Date('1992-02-02'),
        },
        {
          full_name: 'Le Van C',
          email: 'customer3@example.com',
          phone_number: '0912345678',
          created_at: new Date().toISOString(),
          cccd: '234567890123',
          dob: new Date('1988-03-15'),
        },
        {
          full_name: 'Pham Thi D',
          email: 'customer4@example.com',
          phone_number: '0923456789',
          created_at: new Date().toISOString(),
          cccd: '345678901234',
          dob: new Date('1995-07-20'),
        },
        {
          full_name: 'Hoang Van E',
          email: 'customer5@example.com',
          phone_number: '0934567890',
          created_at: new Date().toISOString(),
          cccd: '456789012345',
          dob: new Date('1991-11-30'),
        },
        {
          full_name: 'Vu Thi F',
          email: 'customer6@example.com',
          phone_number: '0945678901',
          created_at: new Date().toISOString(),
          cccd: '567890123456',
          dob: new Date('1993-05-12'),
        },
        {
          full_name: 'Do Van G',
          email: 'customer7@example.com',
          phone_number: '0956789012',
          created_at: new Date().toISOString(),
          cccd: '678901234567',
          dob: new Date('1989-09-25'),
        },
        {
          full_name: 'Bui Thi H',
          email: 'customer8@example.com',
          phone_number: '0967890123',
          created_at: new Date().toISOString(),
          cccd: '789012345678',
          dob: new Date('1994-12-08'),
        },
        {
          full_name: 'Dang Van I',
          email: 'customer9@example.com',
          phone_number: '0978901234',
          created_at: new Date().toISOString(),
          cccd: '890123456789',
          dob: new Date('1987-04-17'),
        },
        {
          full_name: 'Ngo Thi K',
          email: 'customer10@example.com',
          phone_number: '0989012345',
          created_at: new Date().toISOString(),
          cccd: '901234567890',
          dob: new Date('1996-08-22'),
        },
      ];

      const createdCustomers: any[] = [];
      for (const dto of customerDtos) {
        const customer = await this.customersService.create(dto);
        createdCustomers.push(customer);
      }

      // Add the seeded customer to the list
      createdCustomers.push({
        customer_id: customerAuthData.user?.id,
        full_name: process.env.SEED_CUSTOMER_NAME,
        email: process.env.SEED_CUSTOMER_EMAIL,
        phone_number: '0123456789',
        cccd: '123456789012',
        dob: new Date('1990-01-01'),
        created_at: new Date().toISOString(),
      });

      // Seed cinemas
      const cinemaDtos = [
        {
          name: 'Cinema City',
          address: '123 Main St, Hanoi',
        },
        {
          name: 'Galaxy Cinema',
          address: '456 Le Loi, Ho Chi Minh City',
        },
      ];

      const createdCinemas: any[] = [];
      for (const dto of cinemaDtos) {
        const cinema = await this.cinemasService.create(dto);
        createdCinemas.push(cinema);
      }
      const cinemaIds = createdCinemas.map((c) => c.cinema_id);

      // Seed rooms with seats (4 rooms per cinema)
      const roomDtos: any[] = [];
      const roomIds: string[] = [];

      // Define different seat configurations for variety
      const roomConfigs = [
        { rows: 10, cols: 10, skips: [] }, // Standard 10x10
        { rows: 8, cols: 12, skips: [] }, // Wide room
        { rows: 12, cols: 8, skips: [] }, // Tall room
        { rows: 10, cols: 10, skips: [{ type: 'row', index: 5 }] }, // Missing row 5
      ];

      for (const cinemaId of cinemaIds) {
        for (let i = 1; i <= 4; i++) {
          const config = roomConfigs[i - 1]; // Cycle through configs
          const seatsForRoom: any[] = [];

          for (let row = 1; row <= config.rows; row++) {
            // Skip entire row if specified
            if (config.skips.some(skip => skip.type === 'row' && skip.index === row)) {
              continue;
            }

            // Calculate offset to center columns around 0
            const offset = Math.floor((config.cols - 1) / 2);
            const maxCol = offset + (config.cols % 2 === 0 ? 1 : 0);

            for (let col = -offset; col <= maxCol; col++) {
              // Skip entire column if specified
              if (config.skips.some(skip => skip.type === 'col' && skip.index === col)) {
                continue;
              }

              seatsForRoom.push({
                row: row,
                col: col,
                seat_label: String.fromCharCode(64 + row) + (col + offset + 1),
              });
            }
          }

          roomDtos.push({
            cinema_id: cinemaId,
            name: `Room ${i}`,
            seats: seatsForRoom,
          });
        }
      }

      for (const dto of roomDtos) {
        const room = await this.roomsService.create(dto);
        roomIds.push(room.room_id);
      }

      // Seed movies with relative dates
      const today = new Date();
      const formatDate = (date: Date) => date.toISOString().split('T')[0];

      const movieDtos = [
        // Movies released long ago
        {
          title: 'The Shawshank Redemption',
          description:
            'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
          duration_min: 142,
          release_date: formatDate(
            new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000),
          ), // 1 year ago
          rating: 'R',
          poster_url:
            'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
          trailer_url: 'https://youtu.be/PLl99DlL6b4?si=1-FfolHmuBCM3jrK',
          director: 'Frank Darabont',
          actors: ['Tim Robbins', 'Morgan Freeman'],
          genre: ['Drama'],
        },
        {
          title: 'The Dark Knight',
          description:
            'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests.',
          duration_min: 152,
          release_date: formatDate(
            new Date(today.getTime() - 300 * 24 * 60 * 60 * 1000),
          ), // 10 months ago
          rating: 'PG-13',
          poster_url:
            'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
          trailer_url: 'https://youtu.be/EXeTwQWrcwY?si=2rToKDQLXrrCRleh',
          director: 'Christopher Nolan',
          actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
          genre: ['Action', 'Crime', 'Drama'],
        },
        {
          title: 'Inception',
          description:
            'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
          duration_min: 148,
          release_date: formatDate(
            new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000),
          ), // 6 months ago
          rating: 'PG-13',
          poster_url:
            'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
          trailer_url: 'https://youtu.be/YoHD9XEInc0?si=UnRU8YiDEApXEERC',
          director: 'Christopher Nolan',
          actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
          genre: ['Action', 'Sci-Fi', 'Thriller'],
        },
        {
          title: 'Interstellar',
          description:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          duration_min: 169,
          release_date: formatDate(
            new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
          ), // 3 months ago
          rating: 'PG-13',
          poster_url:
            'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
          trailer_url: 'https://youtu.be/zSWdZVtXT7E?si=vSc75JodYT5CNLuG',
          director: 'Christopher Nolan',
          actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
          genre: ['Adventure', 'Drama', 'Sci-Fi'],
        },
        {
          title: 'Parasite',
          description:
            'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
          duration_min: 132,
          release_date: formatDate(
            new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
          ), // 2 months ago
          rating: 'R',
          poster_url:
            'https://s3.amazonaws.com/nightjarprod/content/uploads/sites/130/2024/03/29150816/7IiTTgloJzvGI1TAYymCfbfl3vT-scaled.jpg',
          trailer_url: 'https://youtu.be/5xH0HfJHsaY?si=Izg5WlVPHhkmvxkP',
          director: 'Bong Joon Ho',
          actors: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
          genre: ['Comedy', 'Drama', 'Thriller'],
        },
        // Movies released recently (this week)
        {
          title: 'Avatar: The Way of Water',
          description:
            'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started.',
          duration_min: 192,
          release_date: formatDate(
            new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
          ), // 5 days ago
          rating: 'PG-13',
          poster_url:
            'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg',
          trailer_url: 'https://youtu.be/d9MyW72ELq0?si=nhzbbpt6AdePstcW',
          director: 'James Cameron',
          actors: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
          genre: ['Action', 'Adventure', 'Fantasy'],
        },
        {
          title: 'Oppenheimer',
          description:
            'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
          duration_min: 180,
          release_date: formatDate(
            new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
          ), // 4 days ago
          rating: 'R',
          poster_url:
            'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg',
          trailer_url: 'https://youtu.be/uYPbbksJxIg?si=jvoQkrTYOIag3ucW',
          director: 'Christopher Nolan',
          actors: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon'],
          genre: ['Biography', 'Drama', 'History'],
        },
        {
          title: 'Nhà Gia Tiên',
          description:
            'A Vietnamese horror movie about a family haunted by supernatural forces in their ancestral home.',
          duration_min: 120,
          release_date: formatDate(
            new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
          ), // 3 days ago
          rating: 'R',
          poster_url:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRed6AMI3GCIZF7_QtrFEkXOYkWYxzadM51Vw&s',
          trailer_url: 'https://youtu.be/hXGozmNBwt4?si=Hv36dnMsw-a-oCqb',
          director: 'Nguyen Vinh Son',
          actors: ['Huynh Lap', 'La Thanh'],
          genre: ['Horror'],
        },
        {
          title: 'Dune: Part Two',
          description:
            'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
          duration_min: 166,
          release_date: formatDate(
            new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
          ), // 2 days ago
          rating: 'PG-13',
          poster_url:
            'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
          trailer_url: 'https://youtu.be/Way9Dexny3w?si=E2Ny5r4mHNJ2GJYp',
          director: 'Denis Villeneuve',
          actors: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
          genre: ['Action', 'Adventure', 'Drama'],
        },
        {
          title: 'Spider-Man: Across the Spider-Verse',
          description:
            'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
          duration_min: 140,
          release_date: formatDate(
            new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
          ), // 1 day ago
          rating: 'PG',
          poster_url:
            'https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
          trailer_url: 'https://youtu.be/shW9i6k8cB0?si=-Vsw5DUwHyQeRKRg',
          director: 'Joaquim Dos Santos',
          actors: ['Shameik Moore', 'Hailee Steinfeld', 'Brian Tyree Henry'],
          genre: ['Animation', 'Action', 'Adventure'],
        },
        // Movies not released yet (future)
        {
          title: 'Deadpool & Wolverine',
          description:
            'Deadpool is offered a place in the Marvel Cinematic Universe by the Time Variance Authority, but instead recruits a variant of Wolverine.',
          duration_min: 127,
          release_date: formatDate(
            new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
          ), // 1 week from now
          rating: 'R',
          poster_url:
            'https://resizing.flixster.com/mPJp85eApHd8ih9XF5E9d3-2LbM=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzUxODlkZDE1LTQyYjUtNDg5ZS05NjZmLWMxZDk1YWZhN2E1ZC5qcGc=',
          trailer_url: 'https://youtu.be/73_1biulkYk?si=ZUuUiSSQMdNcba_H',
          director: 'Shawn Levy',
          actors: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin'],
          genre: ['Action', 'Comedy', 'Sci-Fi'],
        },
        {
          title: 'The Batman',
          description:
            "The sequel to Matt Reeves' critically acclaimed The Batman, continuing the dark and gritty story of Bruce Wayne.",
          duration_min: 155,
          release_date: formatDate(
            new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
          ), // 2 weeks from now
          rating: 'PG-13',
          poster_url:
            'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg',
          trailer_url: 'https://youtu.be/mqqft2x_Aa4?si=67h7X7AzvUh9Ixxx',
          director: 'Matt Reeves',
          actors: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano'],
          genre: ['Action', 'Crime', 'Drama'],
        },
        {
          title: 'Mission: Impossible - Dead Reckoning Part Two',
          description:
            'Ethan Hunt and his IMF team must track down a terrifying new weapon before it falls into the wrong hands.',
          duration_min: 163,
          release_date: formatDate(
            new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
          ), // 1 month from now
          rating: 'PG-13',
          poster_url:
            'https://m.media-amazon.com/images/M/MV5BYzFiZjc1YzctMDY3Zi00NGE5LTlmNWEtN2Q3OWFjYjY1NGM2XkEyXkFqcGdeQXVyMTUyMTUzNjQ0._V1_.jpg',
          trailer_url: 'https://youtu.be/fsQgc9pCyDU?si=zEmozQrTDq9bfzQB',
          director: 'Christopher McQuarrie',
          actors: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames'],
          genre: ['Action', 'Adventure', 'Thriller'],
        },
        {
          title: 'Avatar 3',
          description:
            'The third installment in the Avatar franchise, continuing the epic saga on Pandora.',
          duration_min: 195,
          release_date: formatDate(
            new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000),
          ), // 2 months from now
          rating: 'PG-13',
          poster_url:
            'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/c/g/cgv_350x495_1_2.jpg',
          trailer_url: 'https://youtu.be/nb_fFj_0rq8?si=ovPhIhQYo2F2V_Yr',
          director: 'James Cameron',
          actors: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
          genre: ['Action', 'Adventure', 'Fantasy'],
        },
      ];

      const createdMovies: any[] = [];
      for (const dto of movieDtos) {
        const movie = (await this.moviesService.create(dto))[0];
        createdMovies.push(movie);
      }
      const movieIds = createdMovies.map((m) => m.movie_id);

      // Seed products
      const productDtos = [
        {
          name: 'Big Popcorn 35 Oz',
          image: 'https://i.imgur.com/HphT7KN.png',
          price: 70000.0,
          category: 'food',
        },
        {
          name: 'Combo 1 (Big Popcorn + Coke)',
          image: 'https://i.imgur.com/Qr2pwRW.png',
          price: 90000.0,
          category: 'other',
        },
        {
          name: 'Combo 2 (2 Big Popcorn + 2 Coke)',
          image: 'https://i.imgur.com/J8NgzaV.png',
          price: 175000.0,
          category: 'other',
        },
        {
          name: 'Lays 30 Oz',
          image: 'https://i.imgur.com/xH3XypR.png',
          price: 45000.0,
          category: 'food',
        },
        {
          name: 'Water 20 Oz',
          image: 'https://i.imgur.com/cg8Zow1.png',
          price: 20000.0,
          category: 'drink',
        },
        {
          name: 'Sprite 20 Oz',
          image: 'https://i.imgur.com/vUFvQDy.png',
          price: 35000.0,
          category: 'drink',
        },
        {
          name: 'Coke 20 Oz',
          image: 'https://i.imgur.com/AJDaGc7.png',
          price: 30000.0,
          category: 'drink',
        },
        {
          name: 'Small Popcorn 20 Oz',
          image: 'https://i.imgur.com/grWOYhi.png',
          price: 55000.0,
          category: 'food',
        },
      ];

      for (const dto of productDtos) {
        await this.productsService.create(dto);
      }

      // Seed showtimes (one movie per room per time slot - no overlaps)
      const showtimeDtos: any[] = [];
      const now = new Date();

      // Create showtimes from 2 days ago to 6 days in the future (total 9 days)
      for (let day = -2; day <= 6; day++) {
        const date = new Date(now);
        date.setDate(now.getDate() + day);

        // Get movies that are already released by this date
        const availableMovies = createdMovies.filter((movie) => {
          const movieReleaseDate = new Date(movie.release_date);
          return movieReleaseDate <= date;
        });

        if (availableMovies.length === 0) continue;

        // Create showtimes for each room (one movie per time slot)
        for (const roomId of roomIds) {
          // Shuffle available movies for variety
          const shuffledMovies = [...availableMovies].sort(
            () => Math.random() - 0.5,
          );

          // Multiple showtimes throughout the day (8am to 11pm)
          const showtimeSlots = [8, 10, 12, 14, 16, 18, 20, 22];

          for (let i = 0; i < showtimeSlots.length; i++) {
            // Cycle through movies if we have more slots than movies
            const movie = shuffledMovies[i % shuffledMovies.length];
            const hour = showtimeSlots[i];

            const startTime = new Date(date);
            startTime.setHours(hour, 0, 0, 0);
            const endTime = new Date(startTime);
            endTime.setMinutes(startTime.getMinutes() + movie.duration_min);

            // Skip if end time would be after midnight
            if (endTime.getDate() !== startTime.getDate()) {
              continue;
            }

            showtimeDtos.push({
              movie_id: movie.movie_id,
              room_id: roomId,
              start_time: startTime.toISOString(),
              end_time: endTime.toISOString(),
              price: 45000.0 + (hour >= 18 ? 20000.0 : 0), // Evening shows cost more
            });
          }
        }
      }

      const createdShowtimes: any[] = [];

      // Batch insert showtimes (much faster than one-by-one)
      if (showtimeDtos.length > 0) {
        const { data, error } = await this.supabase
          .from('showtimes')
          .insert(showtimeDtos)
          .select();

        if (error) {
          throw new Error(`Failed to create showtimes: ${error.message}`);
        }

        createdShowtimes.push(...(data || []));
      }

      // Get all products for invoice_products
      const { data: allProducts } = await this.supabase
        .from('products')
        .select('*');

      // Get all seats for tickets
      const { data: allSeats } = await this.supabase.from('seats').select('*');

      // Seed invoices with tickets and invoice_products
      const paymentMethods = ['card', 'momo', 'banking'];
      const statuses = ['completed', 'completed', 'completed', 'pending']; // More completed than pending

      for (const customer of createdCustomers) {
        // Each customer has 0-5 invoices
        const invoiceCount = Math.floor(Math.random() * 6); // 0 to 5

        for (let i = 0; i < invoiceCount; i++) {
          // Create invoice with varied dates (from 2 days ago to now - matching showtime range)
          const daysAgo = Math.floor(Math.random() * 3); // 0 to 2 days ago
          const invoiceDate = new Date();
          invoiceDate.setDate(invoiceDate.getDate() - daysAgo);

          const invoiceId = uuidv4();
          const invoiceCode = this.generateInvoiceCode();

          // Select a random showtime from past showtimes
          const pastShowtimes = createdShowtimes.filter((st) => {
            const stDate = new Date(st.start_time);
            return stDate <= invoiceDate;
          });

          if (pastShowtimes.length === 0) continue;

          const selectedShowtime =
            pastShowtimes[Math.floor(Math.random() * pastShowtimes.length)];

          // Get seats for this showtime's room
          if (!allSeats || allSeats.length === 0) continue;

          const roomSeats = allSeats.filter(
            (seat) => seat.room_id === selectedShowtime.room_id,
          );

          // Select 1-4 random seats
          const numSeats = Math.floor(Math.random() * 4) + 1;
          const selectedSeats: any[] = [];
          const availableSeats = [...roomSeats];

          for (let j = 0; j < Math.min(numSeats, availableSeats.length); j++) {
            const randomIndex = Math.floor(
              Math.random() * availableSeats.length,
            );
            selectedSeats.push(availableSeats[randomIndex]);
            availableSeats.splice(randomIndex, 1);
          }

          // Calculate ticket prices
          const ticketTotal = selectedSeats.length * selectedShowtime.price;

          // Select 0-3 random products (ensure no duplicates)
          const numProducts = Math.floor(Math.random() * 4); // 0 to 3
          const selectedProducts: Array<{ product: any; quantity: number }> =
            [];
          let productTotal = 0;

          if (numProducts > 0 && allProducts && allProducts.length > 0) {
            const availableProducts = [...allProducts];
            for (
              let j = 0;
              j < Math.min(numProducts, availableProducts.length);
              j++
            ) {
              const randomIndex = Math.floor(
                Math.random() * availableProducts.length,
              );
              const randomProduct = availableProducts[randomIndex];
              availableProducts.splice(randomIndex, 1); // Remove selected product to avoid duplicates
              const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3
              selectedProducts.push({
                product: randomProduct,
                quantity: quantity,
              });
              productTotal += parseFloat(randomProduct.price) * quantity;
            }
          }

          const totalAmount = ticketTotal + productTotal;

          // Create invoice
          const newInvoice = {
            invoice_id: invoiceId,
            invoice_code: invoiceCode,
            customer_id: customer.customer_id,
            payment_method:
              paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            total_amount: totalAmount.toString(),
            created_at: invoiceDate.toISOString(),
          };

          await this.supabase.from('invoices').insert(newInvoice);

          // Create tickets (batch insert)
          const ticketDtos = selectedSeats.map((seat) => ({
            showtime_id: selectedShowtime.showtime_id,
            invoice_id: invoiceId,
            seat_id: seat.seat_id,
            price: selectedShowtime.price.toString(),
          }));

          if (ticketDtos.length > 0) {
            const { error: ticketError } = await this.supabase
              .from('tickets')
              .insert(ticketDtos);
            if (ticketError) {
              console.error('Ticket creation error:', ticketError);
            }
          }

          // Create invoice_products (batch insert)
          const invoiceProductDtos = selectedProducts.map((productItem) => ({
            invoice_id: invoiceId,
            product_id: productItem.product.product_id,
            quantity: productItem.quantity.toString(),
          }));

          if (invoiceProductDtos.length > 0) {
            const { error: invoiceProductError } = await this.supabase
              .from('invoice_products')
              .insert(invoiceProductDtos);
            if (invoiceProductError) {
              console.error(
                'Invoice product creation error:',
                invoiceProductError,
              );
            }
          }
        }
      }

      // Seed saves (customers saving movies to watchlist)
      // Each customer saves 0-5 movies
      for (const customer of createdCustomers) {
        const numSaves = Math.floor(Math.random() * 6); // 0 to 5 saves per customer
        const savedMovieIds = new Set<string>();

        for (let i = 0; i < numSaves; i++) {
          // Pick a random movie that hasn't been saved yet by this customer
          const availableMovies = createdMovies.filter(
            (movie) => !savedMovieIds.has(movie.movie_id),
          );

          if (availableMovies.length === 0) break;

          const randomMovie =
            availableMovies[Math.floor(Math.random() * availableMovies.length)];

          savedMovieIds.add(randomMovie.movie_id);

          const saveDto = {
            customer_id: customer.customer_id,
            movie_id: randomMovie.movie_id,
          };

          await this.savesService.create(saveDto);
        }
      }

      return { message: 'Seeding completed successfully' };
    } catch (error) {
      throw new Error(`Seeding failed: ${error.message}`);
    }
  }

  private generateInvoiceCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async clear() {
    await this.supabase.from('saves').delete().not('customer_id', 'is', null);
    await this.supabase
      .from('invoice_products')
      .delete()
      .not('invoice_id', 'is', null);
    await this.supabase.from('tickets').delete().not('ticket_id', 'is', null);
    await this.supabase.from('invoices').delete().not('invoice_id', 'is', null);
    await this.supabase
      .from('showtimes')
      .delete()
      .not('showtime_id', 'is', null);
    await this.supabase.from('products').delete().not('product_id', 'is', null);
    await this.supabase.from('movies').delete().not('movie_id', 'is', null);
    await this.supabase.from('seats').delete().not('seat_id', 'is', null);
    await this.supabase.from('rooms').delete().not('room_id', 'is', null);
    await this.supabase.from('cinemas').delete().not('cinema_id', 'is', null);
    await this.supabase
      .from('customers')
      .delete()
      .not('customer_id', 'is', null);
    await this.supabase.from('admins').delete().not('user_id', 'is', null);

    // Delete all auth users
    const { data: authUsers, error: listError } =
      await this.supabase.auth.admin.listUsers();

    if (!listError && authUsers?.users) {
      for (const user of authUsers.users) {
        await this.supabase.auth.admin.deleteUser(user.id);
      }
    }

    return { message: 'Data cleared' };
  }
}
