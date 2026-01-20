import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CustomersModule } from '../customers/customers.module';
import { CinemasModule } from '../cinemas/cinemas.module';
import { RoomsModule } from '../rooms/rooms.module';
import { SeatsModule } from '../seats/seats.module';
import { MoviesModule } from '../movies/movies.module';
import { ProductsModule } from '../products/products.module';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { TicketsModule } from '../tickets/tickets.module';
import { Invoice_productsModule } from '../invoice_products/invoice_products.module';
import { SavesModule } from '../saves/saves.module';
import { SupabaseModule } from 'src/config/supabase.module';
@Module({
  imports: [
    SupabaseModule,
    CustomersModule,
    CinemasModule,
    RoomsModule,
    SeatsModule,
    MoviesModule,
    ProductsModule,
    ShowtimesModule,
    InvoicesModule,
    TicketsModule,
    Invoice_productsModule,
    SavesModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
