import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ratings')
export class Ratings {
  @PrimaryGeneratedColumn('uuid')
  rating_id: string;

  @PrimaryGeneratedColumn('uuid')
  customer_id: string;

  @PrimaryGeneratedColumn('uuid')
  movie_id: string;

  @Column()
  rating_value: string;

  @Column()
  review: string;

  @Column()
  created_at: string;
}
