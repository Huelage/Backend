import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';
import { Vendor } from '../../vendor/vendor.entity';

@Entity({ name: 'canceled_order' })
@ObjectType()
export class CanceledOrder {
  @PrimaryColumn({ type: 'uuid', name: 'order_id' })
  orderId: string;

  @OneToOne(() => Order)
  @Field(() => Order)
  order: Order;

  @ManyToOne(() => Vendor, { cascade: true })
  @Field(() => Vendor)
  vendor: Vendor;

  @Column({ type: 'text' })
  @Field()
  reason: string;

  @Column({ type: 'boolean' })
  @Field()
  refunded: boolean;
}
