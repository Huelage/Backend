import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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

  async editTransactionInfo(params: {
    where: FindOptionsWhere<Transaction>;
    update: QueryDeepPartialEntity<Transaction>;
  }) {
    const { where, update } = params;
    return await this.transactionRepository.update(where, update);
  }
}
