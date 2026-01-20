import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invoice_products')
export class Invoice_products {
  @PrimaryGeneratedColumn('uuid')
  invoice_id: string;

  @PrimaryGeneratedColumn('uuid')
  product_id: string;

  @Column()
  quantity: string;
}
