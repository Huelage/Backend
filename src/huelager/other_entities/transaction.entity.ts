import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Huelager } from '../entities/huelager.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WalletTransaction } from './wallet_transaction.entity';
import { Order, PaymentMethod } from './order/order.entity';

enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
}

enum TransactionType {
  TOP_UP = 'top_up',
  WITHDRAWAL = 'withdrawal',
}

registerEnumType(TransactionStatus, { name: 'TransactionStatus' });
registerEnumType(TransactionType, { name: 'TransactionType' });

@Entity({ name: 'transaction' })
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { name: 'transaction_id' })
  @Field()
  transactionId: string;

  @ManyToOne(() => Huelager, (huelager) => huelager.transaction, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn({ name: 'entity_id' })
  entity: Huelager;

  @Column({ type: 'enum', enum: TransactionType, name: 'transaction_type' })
  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Column({ type: 'decimal' })
  @Field()
  amount: number;

  @Column({ type: 'enum', enum: TransactionStatus })
  @Field(() => TransactionStatus)
  status: TransactionStatus;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: ['pay_on_delivery', 'wallet_balance'],
  })
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({ name: 'pg_transaction_id', type: 'text', nullable: true })
  @Field()
  pgTransactionId: string;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  timestamp: Date;

  @OneToOne(
    () => WalletTransaction,
    (walletTransaction) => walletTransaction.transaction,
  )
  @Field(() => WalletTransaction)
  walletTransaction: WalletTransaction;

  @OneToOne(() => Order, (order) => order.transaction)
  @Field(() => Order)
  order: Order;
}

//penny and dime.
