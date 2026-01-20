import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { SupabaseModule } from 'src/config/supabase.module';
import { EmailModule } from 'src/modules/email/email.module';

@Module({
  imports: [SupabaseModule, EmailModule],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  exports: [ShowtimesService],
})
export class ShowtimesModule {}
