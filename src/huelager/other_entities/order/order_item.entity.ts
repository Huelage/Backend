import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product.entity';

@Entity({ name: 'order_item' })
@ObjectType()
export class OrderItem {
  @PrimaryColumn('uuid', { name: 'order_item_id' })
  @Field()
  orderItemnId: string;

  @ManyToOne(() => Order)
  @Field(() => Order)
  order: Order;

  @OneToOne(() => Product)
  @Field(() => Product)
  product: Product;

  @Column({ name: 'price_per_item', type: 'decimal' })
  @Field()
  pricePerItem: number;

  @Column({ name: 'quantity', type: 'mediumint' })
  @Field()
  quantity: number;

  @Column({ type: 'json', nullable: true })
  @Field(() => JSON, { nullable: true })
  extras: any;
}
