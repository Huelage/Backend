import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Wallet } from '../entities/huenit_wallet.entity';

@Entity({ name: 'wallet_transaction' })
@ObjectType()
export class WalletTransaction {
  @PrimaryColumn({ type: 'uuid', name: 'transaction_id' })
  transactionId: string;

  @OneToOne(() => Transaction)
  @Field(() => Transaction)
  @JoinColumn()
  transaction: Transaction;

  @ManyToOne(() => Wallet, { cascade: true })
  @JoinColumn({ name: 'sender_wallet' })
  senderWallet: Wallet;

  @ManyToOne(() => Wallet, { cascade: true })
  @JoinColumn({ name: 'receiver_wallet' })
  receiverWallet: Wallet;
}
