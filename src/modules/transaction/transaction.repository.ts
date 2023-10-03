import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(createTransactionInfo: DeepPartial<Transaction>) {
    const transaction = await this.transactionRepository.create({
      ...createTransactionInfo,
    });

    await this.transactionRepository.save(transaction);
    return transaction;
  }
}