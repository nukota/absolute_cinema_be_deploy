import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn('uuid')
  product_id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  price: string;

  @Column()
  image: string;

  @Column()
  created_at: string;
}
