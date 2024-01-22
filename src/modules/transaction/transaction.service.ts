import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { TransactionRepository } from './transaction.repository';
import { OrderTransactionDto } from './dtos/order-transaction.dto';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from './entities/transaction.entity';
import { PaymentMethod } from '../order/entities/order.entity';
import { TopupInput } from './dtos/topup.input';
import { HuelagerRepository } from '../huelager/huelager.repository';
import { WithdrawalInput } from './dtos/withdrawal.input';
import { TransferInput } from './dtos/transfer.input';
import { Huelager } from '../huelager/entities/huelager.entity';
import { pubSub } from '../huelager/huelager.resolver';

@Injectable()
export class TransactionService {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly huelagerRepository: HuelagerRepository,
  ) {}

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
      timestamp,
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
      timestamp: timestamp,

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

    pubSub.publish(`transaction-${userId}`, {
      transactionHistoryUpdated: transaction,
    });

    pubSub.publish(`transaction-${vendorId}`, {
      transactionHistoryUpdated: transaction,
    });

    return transaction;
  }

  async transfer(transferInput: TransferInput) {
    const { accountNumber, amount, sender } = transferInput;

    if (sender.wallet.accountNumber === accountNumber)
      throw new UnauthorizedException(`You cannot send to yourself.`);

    const receiverWallet = await this.huelagerRepository.findWallet({
      where: { accountNumber },
    });

    if (!receiverWallet)
      throw new NotFoundException(
        `Wallet account number ${accountNumber} not found.`,
      );

    receiverWallet.balance = Number(receiverWallet.balance) + amount;
    await this.huelagerRepository.saveWallet(receiverWallet);

    const senderWallet = await this.huelagerRepository.subtractFromBalance(
      sender.entityId,
      amount,
    );

    const transaction = await this.repository.createTransaction({
      cardAmount: 0,
      totalAmount: amount,
      huenitAmount: amount,
      initiatorEntity: sender,
      status: TransactionStatus.COMPLETED,
      paymentMethod: PaymentMethod.HUENIT,
    });

    transaction.walletTransaction = {
      receiverWallet,
      senderWallet,
      transaction,
      transactionId: transaction.transactionId,
    };

    await this.repository.saveWalletTransaction(transaction.walletTransaction);
    await this.repository.saveTransaction(transaction);

    pubSub.publish(`wallet-${receiverWallet.walletId}`, {
      walletBalanceUpdated: receiverWallet.balance,
    });

    pubSub.publish(`wallet-${senderWallet.walletId}`, {
      walletBalanceUpdated: senderWallet.balance,
    });

    pubSub.publish(`transaction-${receiverWallet.entity.entityId}`, {
      transactionHistoryUpdated: transaction,
    });

    return transaction;
  }

  async topUp(topupInput: TopupInput): Promise<Transaction> {
    const { bankName, bankAccountNo, amount, entity, pgTransactionId } =
      topupInput;
    const { entityId } = entity;

    const wallet = await this.huelagerRepository.addToBalance(entityId, amount);

    const transaction = await this.repository.createTransaction({
      bankAccountNo,
      bankName,
      cardAmount: amount,
      totalAmount: amount,
      initiatorEntity: entity,
      status: TransactionStatus.COMPLETED,
      paymentMethod: PaymentMethod.CARD,
      pgTransactionId,
    });

    transaction.walletTransaction = {
      receiverWallet: wallet,
      senderWallet: wallet,
      transaction,
      transactionId: transaction.transactionId,
    };

    await this.repository.saveWalletTransaction(transaction.walletTransaction);
    await this.repository.saveTransaction(transaction);

    pubSub.publish(`wallet-${wallet.walletId}`, {
      walletBalanceUpdated: wallet.balance,
    });

    return transaction;
  }

  async withdrawal(withdrawalInput: WithdrawalInput) {
    const { bankName, bankAccountNo, amount, entity, pgTransactionId } =
      withdrawalInput;

    const { entityId } = entity;
    const wallet = await this.huelagerRepository.subtractFromBalance(
      entityId,
      amount,
    );

    const transaction = await this.repository.createTransaction({
      bankAccountNo,
      bankName,
      cardAmount: amount,
      totalAmount: amount,
      initiatorEntity: entity,
      status: TransactionStatus.COMPLETED,
      paymentMethod: PaymentMethod.CARD,
      pgTransactionId,
    });

    transaction.walletTransaction = {
      receiverWallet: wallet,
      senderWallet: wallet,
      transaction,
      transactionId: transaction.transactionId,
    };

    await this.repository.saveWalletTransaction(transaction.walletTransaction);
    await this.repository.saveTransaction(transaction);

    pubSub.publish(`wallet-${wallet.walletId}`, {
      walletBalanceUpdated: wallet.balance,
    });

    return transaction;
  }

  async getTransactions({ entityId }: Huelager) {
    const transactions = await this.repository.getTransactions({
      where: [
        { initiatorEntity: { entityId } },
        { walletTransaction: { receiverWallet: { entity: { entityId } } } },
      ],
    });

    return transactions;
  }

  async getWalletTransactions({ entityId }: Huelager) {
    const walletTransactions = await this.repository.getWalletTransactions({
      where: [
        { senderWallet: { entity: { entityId } } },
        { receiverWallet: { entity: { entityId } } },
      ],
    });

    return walletTransactions;
  }
}
