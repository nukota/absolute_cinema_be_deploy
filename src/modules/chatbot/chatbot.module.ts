import { Module } from '@nestjs/common';
import { GeminiController } from './chatbot.controller';
import { GeminiService } from './chatbot.service';
import { MoviesModule } from '../movies/movies.module';
import { CinemasModule } from '../cinemas/cinemas.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [MoviesModule, CinemasModule, ProductsModule],
  controllers: [GeminiController],
  providers: [GeminiService],
})
export class ChatbotModule {}
