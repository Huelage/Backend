import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product.entity';

@Entity({ name: 'order_item' })
@ObjectType()
export class OrderItem {
  @PrimaryColumn('uuid', { name: 'order_item_id' })
  @Field()
  orderItemnId: string;

  @ManyToOne(() => Order, { cascade: true, nullable: false })
  @JoinColumn({ name: 'order_id' })
  @Field(() => Order)
  order: Order;

  @OneToOne(() => Product, (product) => product.orderItem, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'product_id' })
  @Field(() => Product)
  product: Product;

  @Column({ name: 'price_per_item', type: 'decimal' })
  @Field()
  pricePerItem: number;

  @Column({ name: 'quantity', type: 'mediumint' })
  @Field()
  quantity: number;

  @Column({ type: 'json', nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  extras: any;
}
