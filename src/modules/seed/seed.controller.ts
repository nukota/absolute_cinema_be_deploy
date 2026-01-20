import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Post()
  async seed() {
    return this.seedService.seed();
  }

  @Post('clear')
  async clear() {
    return this.seedService.clear();
  }
}