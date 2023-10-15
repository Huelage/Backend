import { Injectable } from '@nestjs/common';

import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  constructor(private readonly repository: TransactionRepository) {}
}
