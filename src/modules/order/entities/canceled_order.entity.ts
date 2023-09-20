import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'canceled_order' })
@ObjectType()
export class CanceledOrder {
  @PrimaryColumn({ type: 'uuid', name: 'order_id' })
  orderId: string;

  @OneToOne(() => Order, (order) => order.canceledOrder, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  @Field(() => Order)
  order: Order;

  @Column({ type: 'text' })
  @Field()
  reason: string;

  @Column({ type: 'boolean' })
  @Field()
  refunded: boolean;
}
