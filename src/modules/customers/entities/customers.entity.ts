import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class Customers {
  @PrimaryGeneratedColumn('uuid')
  customer_id: string;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  created_at: string;

  @Column()
  cccd: string;

  @Column()
  dob: Date;
}
