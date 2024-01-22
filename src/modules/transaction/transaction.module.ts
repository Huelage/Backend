import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { WalletTransaction } from './entities/wallet_transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { HuelagersModule } from '../huelager/huelagers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, WalletTransaction]),
    HuelagersModule,
  ],
  providers: [TransactionResolver, TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
