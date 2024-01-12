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
import GraphQLJSON from 'graphql-type-json';
import { AddressInterface } from 'src/modules/huelager/dtos/create-account.input';
import { WalletTransaction } from '../../../modules/transaction/entities/wallet_transaction.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  EN_ROUTE = 'en_route',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  SPLIT = 'split',
  HUENIT = 'huenit',
  CARD = 'card',
}

export enum PaymentStatus {
  PAID = 'paid',
  SPLIT = 'split',
  PENDING = 'pending',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });
registerEnumType(PaymentMethod, { name: 'PaymentMethod' });
registerEnumType(PaymentStatus, { name: 'PaymentStatus' });

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

  @Column({ name: 'delivery_addr', type: 'json', nullable: true })
  @Field(() => GraphQLJSON)
  deliveryAddress: AddressInterface;

  @Column({ name: 'estimated_delivery_time', type: 'datetime', nullable: true })
  @Field()
  estimatedDeliveryTime: Date;

  @Column({ type: 'decimal' })
  @Field()
  subtotal: number;

  @Column({ name: 'delivery_fee', type: 'decimal', nullable: true })
  @Field()
  deliveryFee: number;

  @Column({ nullable: true, type: 'decimal' })
  @Field({ nullable: true })
  discount: number;

  @Column({ name: 'payment_breakdown', type: 'json', nullable: true })
  @Field(() => [GraphQLJSON])
  paymentBreakdown: { name: string; amount: number }[];

  @Column({ name: 'total_amount', type: 'decimal' })
  @Field()
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: ['split', 'huenit', 'card'],
    name: 'payment_method',
    nullable: true,
  })
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({
    name: 'payment_status',
    type: 'boolean',
  })
  @Field()
  paymentStatus: PaymentStatus;

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

  @OneToOne(
    () => WalletTransaction,
    (walletTransaction) => walletTransaction.order,
    { nullable: true },
  )
  @Field(() => [WalletTransaction], { nullable: true })
  walletTransaction: WalletTransaction;
}
