import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Huelager } from '../../huelager/entities/huelager.entity';
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
import { Order, PaymentMethod } from '../../order/entities/order.entity';

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

  @ManyToOne(() => Huelager, (huelager) => huelager.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inittiator_entity_id' })
  initiatorEntity: Huelager;

  @Column({ type: 'enum', enum: TransactionType, name: 'transaction_type' })
  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Column({ type: 'decimal' })
  @Field()
  huenit_amount: number;

  @Column({ type: 'decimal' })
  @Field()
  card_amount: number;

  @Column({ type: 'decimal' })
  @Field()
  total_amount: number;

  @Column({ type: 'enum', enum: TransactionStatus })
  @Field(() => TransactionStatus)
  status: TransactionStatus;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: ['card', 'huenit', 'split'],
  })
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({ name: 'pg_transaction_id', type: 'text', nullable: true })
  @Field()
  pgTransactionId: string;

  @CreateDateColumn({
    type: 'datetime',
    nullable: true,
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
