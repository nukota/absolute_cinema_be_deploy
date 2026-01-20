import { Module } from '@nestjs/common';
import { SupabaseModule } from 'src/config/supabase.module';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule { }
