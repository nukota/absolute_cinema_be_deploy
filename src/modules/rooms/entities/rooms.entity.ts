import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rooms')
export class Rooms {
  @PrimaryGeneratedColumn('uuid')
  room_id: string;

  @PrimaryGeneratedColumn('uuid')
  cinema_id: string;

  @Column()
  name: string;

  @Column()
  capacity: string;

  @Column()
  created_at: string;
}
