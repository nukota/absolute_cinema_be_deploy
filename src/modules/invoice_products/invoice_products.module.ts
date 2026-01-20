import { Module } from '@nestjs/common';
import { Invoice_productsService } from './invoice_products.service';
import { Invoice_productsController } from './invoice_products.controller';
import { SupabaseModule } from 'src/config/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [Invoice_productsController],
  providers: [Invoice_productsService],
  exports: [Invoice_productsService],
})
export class Invoice_productsModule {}
