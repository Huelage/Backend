import { Injectable } from '@nestjs/common';

import { TransactionRepository } from './transaction.repository';
import { OrderTransactionDto } from './dtos/order-transaction.dto';
import {
  TransactionStatus,
  TransactionType,
} from './entities/transaction.entity';
import { PaymentMethod } from '../order/entities/order.entity';

@Injectable()
export class TransactionService {
  constructor(private readonly repository: TransactionRepository) {}

  async orderTransaction(orderTransactionDto: OrderTransactionDto) {
    const {
      vendorId,
      userId,
      huenitAmount,
      cardAmount,
      totalAmount,
      paymentMethod,
      pgTransactionId,
      senderWallet,
      receiverWallet,
      order,
    } = orderTransactionDto;

    const transaction = await this.repository.createTransaction({
      initiatorEntity: { entityId: userId },
      transactionType: TransactionType.WITHDRAWAL,
      huenitAmount,
      cardAmount,
      totalAmount,
      paymentMethod,
      status: TransactionStatus.COMPLETED,
      pgTransactionId,
      timestamp: new Date(),

      order,
    });

    if (paymentMethod != PaymentMethod.CARD) {
      transaction.walletTransaction = {
        senderWallet,
        receiverWallet,
        transaction,
        transactionId: transaction.transactionId,
      };
      await this.repository.saveWalletTransaction(
        transaction.walletTransaction,
      );
    }
    await this.repository.saveTransaction(transaction);

    return transaction;
  }
}
