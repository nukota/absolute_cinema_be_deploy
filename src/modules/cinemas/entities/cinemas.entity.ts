import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cinemas')
export class Cinemas {
  @PrimaryGeneratedColumn('uuid')
  cinema_id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  created_at: Date;
}
