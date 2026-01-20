import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to NestJS Supabase Template API! Visit /api for Swagger documentation.';
  }
}
