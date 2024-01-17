import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Wallet } from '../../huelager/entities/huenit_wallet.entity';

@Entity({ name: 'wallet_transaction' })
@ObjectType()
export class WalletTransaction {
  @PrimaryColumn({ type: 'uuid', name: 'transaction_id' })
  transactionId: string;

  @OneToOne(() => Transaction, (transaction) => transaction.walletTransaction, {
    onDelete: 'CASCADE',
  })
  @Field(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Wallet, { nullable: false })
  @JoinColumn({ name: 'sender_wallet_id' })
  senderWallet: Wallet;

  @ManyToOne(() => Wallet, { nullable: false })
  @JoinColumn({ name: 'receiver_wallet_id' })
  receiverWallet: Wallet;
}
