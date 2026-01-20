import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('seats')
export class Seats {
  @PrimaryGeneratedColumn('uuid')
  seat_id: string;

  @Column({ type: 'uuid' })
  room_id: string;

  @Column({ type: 'int' })
  row: number;

  @Column({ type: 'int' })
  col: number;

  @Column({ type: 'varchar', length: 10 })
  seat_label: string;
}
