import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Transaction } from './entities/transaction.entity';
import { WalletTransaction } from './entities/wallet_transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(WalletTransaction)
    private readonly walletTransactionRepository: Repository<WalletTransaction>,
  ) {}

  async createTransaction(createTransactionInfo: DeepPartial<Transaction>) {
    const transaction = await this.transactionRepository.create({
      ...createTransactionInfo,
    });

    await this.transactionRepository.save(transaction);
    return transaction;
  }

  async saveTransaction(transaction: Transaction) {
    this.transactionRepository.save(transaction);
  }

  async saveWalletTransaction(transaction: WalletTransaction) {
    this.walletTransactionRepository.save(transaction);
  }

  async editTransactionInfo(params: {
    where: FindOptionsWhere<Transaction>;
    update: QueryDeepPartialEntity<Transaction>;
  }) {
    const { where, update } = params;
    return await this.transactionRepository.update(where, update);
  }

  async getTransactions(params: { where: FindOptionsWhere<Transaction>[] }) {
    const { where } = params;
    const transactions = await this.transactionRepository.find({
      where,
      relations: {
        walletTransaction: {
          senderWallet: true,
          receiverWallet: true,
        },
        order: true,
      },
    });

    return transactions;
  }

  async getWalletTransactions(params: {
    where: FindOptionsWhere<WalletTransaction>[];
  }) {
    const { where } = params;
    const walletTransactions = await this.walletTransactionRepository.find({
      where,
      relations: { transaction: true },
    });

    return walletTransactions;
  }
}
