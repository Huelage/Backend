import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Order } from './order.entity';
import { Vendor } from '../../huelager/vendor/vendor.entity';

@Entity({ name: 'canceled_order' })
@ObjectType()
export class CanceledOrder {
  @OneToOne(() => Order)
  @Field()
  order: Order;

  @ManyToOne(() => Vendor)
  @Field(() => Vendor)
  vendor: Vendor;

  @Column({ type: 'text' })
  @Field()
  reason: string;

  @Column({ type: 'boolean' })
  @Field()
  refunded: boolean;
}
