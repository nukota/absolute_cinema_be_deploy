import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './modules/admins/admins.module';
import { CinemasModule } from './modules/cinemas/cinemas.module';
import { CustomersModule } from './modules/customers/customers.module';
import { Invoice_productsModule } from './modules/invoice_products/invoice_products.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { MoviesModule } from './modules/movies/movies.module';
import { ProductsModule } from './modules/products/products.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { SavesModule } from './modules/saves/saves.module';
import { SeatsModule } from './modules/seats/seats.module';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { EmailModule } from './modules/email/email.module';
import { SeedModule } from './modules/seed/seed.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { VnpayModule } from './modules/vnpay/vnpay.module';

@Module({
  imports: [
    // Configuration module - load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Feature modules
    AuthModule,
    AdminsModule,
    CinemasModule,
    CustomersModule,
    Invoice_productsModule,
    InvoicesModule,
    MoviesModule,
    ProductsModule,
    RatingsModule,
    RoomsModule,
    SavesModule,
    SeatsModule,
    ShowtimesModule,
    TicketsModule,
    EmailModule,
    SeedModule,
    ChatbotModule,
    VnpayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
