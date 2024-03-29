import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Order } from './order.entity';

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

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  @Field(() => Product)
  product: Product;

  @Column({ name: 'total_price', type: 'decimal' })
  @Field()
  totalPrice: number;

  @Column({ name: 'quantity', type: 'mediumint' })
  @Field()
  quantity: number;

  @Column({ name: 'portion', type: 'mediumint', nullable: true })
  @Field({ nullable: true })
  portion: number;

  @Column({ name: 'price', type: 'decimal', nullable: true })
  @Field({ nullable: true })
  price: number;

  @Column({ name: 'size', type: 'text', nullable: true })
  @Field({ nullable: true })
  size: string;

  @Column({ type: 'json', nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  extras: { name: string; price: number; quantity: number }[];
}
