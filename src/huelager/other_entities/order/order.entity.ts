import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from '../../user/user.entity';
import { Vendor } from '../../vendor/vendor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  Transaction,
} from 'typeorm';

enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_DELIVERY = 'in_delivery',
  DELIEVERED = 'delivered',
}

export enum PaymentMethod {
  PAY_ON_DELIVERY = 'pay_on_delivery',
  WALLET_BALANCE = 'wallet_balance',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });
registerEnumType(PaymentMethod, { name: 'PaymentMethod' });

@Entity({ name: 'order' })
@ObjectType()
export class Order {
  @PrimaryColumn('uuid', { name: 'order_id' })
  orderId: string;

  @ManyToOne(() => User, { cascade: true })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Vendor, { cascade: true })
  @Field(() => Vendor)
  vendor: Vendor;

  // @OneToOne(() => Transaction)
  // @JoinColumn()
  // @Field(() => Transaction)
  // transaction: Transaction;

  @Column({ type: 'enum', enum: OrderStatus })
  @Field(() => OrderStatus)
  status: OrderStatus;

  @Column({ name: 'delivery_addr', type: 'text' })
  @Field()
  deliveryAddress: string;

  @Column({ type: 'decimal' })
  @Field()
  subtotal: number;

  @Column({ name: 'delivery_fee', type: 'decimal' })
  @Field()
  deliveryFee: number;

  @Column({ name: 'total_amount', type: 'decimal' })
  @Field()
  totalAmount: number;

  @Column({ type: 'enum', enum: PaymentMethod, name: 'payment_method' })
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({ name: 'payment_status', type: 'boolean', default: false })
  @Field()
  paymentStatus: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  createdAt: Date;
}

('If you find a child playing with a knife, rather than forcefully collecting it, offer it a candy.');
('if you find a child playing with a knife, rather than forcefully collecting it, offer it a candy.');
