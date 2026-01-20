import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admins')
export class Admins {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column()
  created_at: string;
}
