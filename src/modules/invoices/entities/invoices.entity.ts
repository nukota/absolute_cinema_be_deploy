import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invoices')
export class Invoices {
  @PrimaryGeneratedColumn('uuid')
  invoice_id: string;

  @PrimaryGeneratedColumn('uuid')
  customer_id: string;

  @Column()
  payment_method: string;

  @Column()
  status: string;

  @Column()
  total_amount: string;

  @Column()
  created_at: string;

  @Column()
  invoice_code: string;
}
