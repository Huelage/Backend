import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { WalletTransaction } from './entities/wallet_transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, WalletTransaction])],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
