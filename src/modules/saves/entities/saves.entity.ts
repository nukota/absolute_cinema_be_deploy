import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('saves')
export class Saves {
  @PrimaryGeneratedColumn('uuid')
  customer_id: string;

  @PrimaryGeneratedColumn('uuid')
  movie_id: string;

  @Column()
  created_at: string;
}
