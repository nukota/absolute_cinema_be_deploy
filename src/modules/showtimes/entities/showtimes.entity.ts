import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('showtimes')
export class Showtimes {
  @PrimaryGeneratedColumn('uuid')
  showtime_id: string;

  @PrimaryGeneratedColumn('uuid')
  movie_id: string;

  @PrimaryGeneratedColumn('uuid')
  room_id: string;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column()
  price: string;

  @Column()
  created_at: string;
}
