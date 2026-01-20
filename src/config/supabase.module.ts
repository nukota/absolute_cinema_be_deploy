import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createSupabaseClient } from './supabase.config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createSupabaseClient(configService, true), // true = dùng service role
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule { }
