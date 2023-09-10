import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Huelager } from '../entities/huelager.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentMethod } from './order/order.entity';

enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
}

enum TransactionType {
  TOP_UP = 'top_up',
  WITHDRAWAL = 'withdrawal',
}

registerEnumType(TransactionStatus);
registerEnumType(PaymentMethod);
registerEnumType(TransactionType);

@Entity({ name: 'transaction' })
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { name: 'transaction_id' })
  @Field()
  transactionId: string;

  @ManyToOne(() => Huelager, (huelager) => huelager.biometrics)
  @JoinColumn()
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

  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod })
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({ name: 'pg_transaction_id', type: 'text', nullable: true })
  @Field()
  pgTransactionId: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  timestamp: Date;
}

//penny and dime.
