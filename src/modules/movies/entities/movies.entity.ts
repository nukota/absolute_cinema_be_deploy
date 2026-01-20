import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('movies')
export class Movies {
  @PrimaryGeneratedColumn('uuid')
  movie_id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true, unique: true })
  slug?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int' })
  duration_min: number;

  @Column({ type: 'date' })
  release_date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  rating?: string;

  @Column({ type: 'varchar', length: 255 })
  poster_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  trailer_url?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  director?: string;

  @Column({ type: 'json', nullable: true })
  actors?: any; // bạn có thể define interface riêng cho diễn viên nếu muốn

  @Column({ type: 'json', nullable: true })
  genre?: any; // ví dụ: ["Action", "Drama"]

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;
}
