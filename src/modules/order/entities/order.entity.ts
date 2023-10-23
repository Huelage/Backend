import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from '../../huelager/user/user.entity';
import { Vendor } from '../../huelager/vendor/vendor.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CanceledOrder } from './canceled_order.entity';
import { OrderItem } from './order_item.entity';

enum OrderStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  READY = 'ready',
  IN_DELIVERY = 'in_delivery',
  DELIEVERED = 'delivered',
  CANCELED = 'canceled',
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
  @PrimaryGeneratedColumn('uuid', { name: 'order_id' })
  @Field()
  orderId: string;

  @ManyToOne(() => User, (user) => user.orders, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Vendor, (vendor) => vendor.orders, {
    cascade: true,
  })
  @JoinColumn({ name: 'vendor_id' })
  @Field(() => Vendor)
  vendor: Vendor;

  /**
   * It can be nullable because the transaction only takes place after the order has been fanilized
   */
  @OneToOne(() => Transaction, (transaction) => transaction.order, {
    cascade: true,
  })
  @JoinColumn({ name: 'transction_id' })
  @Field(() => Transaction, { nullable: true })
  transaction: Transaction;

  @Column({ type: 'enum', enum: OrderStatus })
  @Field(() => OrderStatus)
  status: OrderStatus;

  @Column({ name: 'delivery_addr', type: 'text', nullable: true })
  @Field()
  deliveryAddress: string;

  @Column({ type: 'decimal' })
  @Field()
  subtotal: number;

  @Column({ name: 'delivery_fee', type: 'decimal', nullable: true })
  @Field()
  deliveryFee: number;

  @Column({ name: 'total_amount', type: 'decimal' })
  @Field()
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: ['pay_on_delivery', 'wallet_balance'],
    name: 'payment_method',
  })
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({ name: 'payment_status', type: 'boolean', default: false })
  @Field()
  paymentStatus: boolean;

  @CreateDateColumn({
    name: 'ordered_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  orderedAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  updatedAt: Date;

  @OneToOne(() => CanceledOrder, (canceledOrder) => canceledOrder.order)
  @Field(() => CanceledOrder)
  canceledOrder: CanceledOrder;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  @Field(() => [OrderItem])
  orderItems: OrderItem[];
}

('If you find a child playing with a knife, rather than forcefully collecting it, offer it a candy.');
('if you find a child playing with a knife, rather than forcefully collecting it, offer it a candy.');
