import { Injectable, Inject } from '@nestjs/common';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { UpdateTicketsDto } from './dto/update-tickets.dto';
import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { error } from 'console';

@Injectable()
export class TicketsService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) { }

  async create(dto: CreateTicketsDto) {
    const newTicket = {
      ticket_id: uuidv4(), // generate UUID
      ...dto,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('tickets')
      .insert(newTicket)
      .select();

    if (error) throw error;
    return data;
  }

  // Get all tickets
  async findAll() {
    const { data, error } = await this.supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get a ticket by ID
  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('tickets')
      .select('*')
      .eq('ticket_id', id);

    if (error) throw error;
    return data;
  }

  // Update ticket
  async update(id: string, dto: UpdateTicketsDto) {
    const { data, error } = await this.supabase
      .from('tickets')
      .update(dto)
      .eq('ticket_id', id)
      .select();

    if (error) throw error;
    return data;
  }

  // Delete ticket
  async remove(id: string) {
    const { error } = await this.supabase
      .from('tickets')
      .delete()
      .eq('ticket_id', id);

    if (error) throw error;
    return { message: `Ticket with id ${id} deleted successfully` };
  }

  async removeByInvoiceId(invoice_id: string) {
    const { error } = await this.supabase
      .from('tickets')
      .delete()
      .eq('invoice_id', invoice_id);

    if (error) throw error;
    return { message: `Tickets with invoice id ${invoice_id} deleted successfully` };
  }
}