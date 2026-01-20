import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

/**
 * Creates and returns a Supabase client instance
 * @param configService - NestJS ConfigService to access environment variables
 * @param useServiceRole - If true, uses service role key (for admin operations)
 * @returns SupabaseClient instance
 */
export function createSupabaseClient(
  configService: ConfigService,
  useServiceRole = false,
): SupabaseClient {
  const supabaseUrl = configService.get<string>('SUPABASE_URL');
  const supabaseKey = useServiceRole
    ? configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')
    : configService.get<string>('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key must be provided');
  }

  return createClient(supabaseUrl, supabaseKey);
}
