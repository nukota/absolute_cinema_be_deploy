import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCustomersDto } from './dto/create-customers.dto';
import { UpdateCustomersDto } from './dto/update-customers.dto';
import { CustomersResponseDto } from './dto/customers-response.dto';
import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CustomersService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async create(dto: CreateCustomersDto): Promise<CustomersResponseDto> {
    const newCustomer = {
      customer_id: uuidv4(),
      full_name: dto.full_name,
      email: dto.email,
      phone_number: dto.phone_number,
      cccd: dto.cccd,
      dob: dto.dob,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('customers')
      .insert(newCustomer)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to create customer: ${error.message}`,
      );
    }

    return newCustomer;
  }

  async findAll(): Promise<CustomersResponseDto[]> {
    const { data, error } = await this.supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to fetch customers: ${error.message}`,
      );
    }

    return data;
  }

  async findOne(id: string): Promise<CustomersResponseDto> {
    const { data, error } = await this.supabase
      .from('customers')
      .select('*')
      .eq('customer_id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return data;
  }

  async update(
    id: string,
    dto: UpdateCustomersDto,
  ): Promise<CustomersResponseDto> {
    await this.findOne(id);

    const updateData: any = { ...dto };

    const { data, error } = await this.supabase
      .from('customers')
      .update(updateData)
      .eq('customer_id', id)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to update customer: ${error.message}`,
      );
    }
    return data;
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);

    const { error } = await this.supabase
      .from('customers')
      .delete()
      .eq('customer_id', id);

    if (error) {
      throw new InternalServerErrorException(
        `Failed to delete cinema: ${error.message}`,
      );
    }

    return {
      message: `Cinema with ID ${id} has been deleted successfully`,
    };
  }
}
