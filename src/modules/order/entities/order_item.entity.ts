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
import { Product } from '../../product/entities/product.entity';

@Entity({ name: 'order_item' })
@ObjectType()
export class OrderItem {
  @PrimaryColumn('uuid', { name: 'item_id' })
  @Field()
  itemId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  @Field(() => Order)
  order: Order;

  @OneToOne(() => Product, (product) => product.orderItem)
  @JoinColumn({ name: 'product_id' })
  @Field(() => Product)
  product: Product;

  @Column({ name: 'total_price', type: 'decimal' })
  @Field()
  totalPrice: number;

  @Column({ name: 'quantity', type: 'mediumint' })
  @Field()
  quantity: number;

  @Column({ name: 'size', type: 'string' })
  @Field()
  size: string;

  @Column({ type: 'json', nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  extras: { name: string; price: number; quantity: number }[];
}
