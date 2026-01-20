import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateInvoicesDto } from './dto/update-invoices.dto';
import { DashboardData } from './dto/dashboard.dto';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly service: InvoicesService) { }

  @Post('booking')
  @ApiOperation({ summary: 'Create a new booking with tickets and products' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  createBooking(@Body() dto: CreateBookingDto) {
    return this.service.createBooking(dto);
  }

  @Post()
  @ApiOperation({ summary: 'Create an invoice' })
  create(@Body() dto: CreateBookingDto) {
    return this.service.createBooking(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  findAll() {
    return this.service.findAll();
  }

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics and analytics' })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Month in YYYY-MM format (default: current month)',
    example: '2025-11',
  })
  @ApiResponse({ status: 200, type: DashboardData, description: 'Dashboard data with statistics' })
  getDashboard(@Query('month') month?: string) {
    return this.service.getDashboardData(month);
  }

  @Get('customer/:customer_id')
  @ApiOperation({ summary: 'Get user profile with booking history' })
  GetUserProfile(@Param('customer_id') customerId: string) {
    return this.service.getUserProfile(customerId);
  }

  @Get('customer/:customer_id/history')
  @ApiOperation({ summary: 'Get booking history for customer' })
  getBookingHistory(@Param('customer_id') customerId: string) {
    return this.service.getBookingHistory(customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an invoice' })
  update(@Param('id') id: string, @Body() dto: UpdateInvoicesDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an invoice' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
