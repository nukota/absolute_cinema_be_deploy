import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tickets')
export class Tickets {
  @PrimaryGeneratedColumn('uuid')
  ticket_id: string;

  @PrimaryGeneratedColumn('uuid')
  showtime_id: string;

  @PrimaryGeneratedColumn('uuid')
  invoice_id: string;

  @PrimaryGeneratedColumn('uuid')
  seat_id: string;

  @Column()
  price: string;

  @Column()
  created_at: string;
}
