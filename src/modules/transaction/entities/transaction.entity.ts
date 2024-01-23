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

export enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
}

export enum TransactionType {
  TOP_UP = 'top_up',
  PURCHASE = 'purchase',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'trasfer',
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
  @JoinColumn({ name: 'initiator_entity_id' })
  initiatorEntity: Huelager;

  @Column({ type: 'enum', enum: TransactionType, name: 'transaction_type' })
  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Column({ type: 'float', name: 'huenit_amount', default: 0 })
  @Field()
  huenitAmount: number;

  @Column({ type: 'float', name: 'card_amount', default: 0 })
  @Field()
  cardAmount: number;

  @Column({ type: 'float', name: 'total_amount' })
  @Field()
  totalAmount: number;

  @Column({ type: 'enum', enum: TransactionStatus })
  @Field(() => TransactionStatus)
  status: TransactionStatus;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
    enumName: 'PaymentMethod',
  })
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({ name: 'pg_transaction_id', type: 'text', nullable: true })
  @Field()
  pgTransactionId: string;

  @Column({ name: 'bank_name', nullable: true, type: 'varchar' })
  @Field({ nullable: true })
  bankName: string;

  @Column({ name: 'bank_acc_no', nullable: true, type: 'varchar' })
  @Field({ nullable: true })
  bankAccountNo: string;

  @CreateDateColumn({ type: 'datetime', nullable: true })
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
