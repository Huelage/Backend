import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { TopupInput } from './dtos/topup.input';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { AccessTokenRequest } from 'src/common/interfaces/request.interface';
import { TransferInput } from './dtos/transfer.input';
import { WalletTransaction } from './entities/wallet_transaction.entity';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AccessTokenGuard)
  @Query(() => [Transaction])
  async getTransactions(
    @Context('req') { user: huelager }: AccessTokenRequest,
  ): Promise<Transaction[]> {
    return await this.transactionService.getTransactions(huelager);
  }

  @UseGuards(AccessTokenGuard)
  @Query(() => [WalletTransaction])
  async getWalletTransactions(
    @Context('req') { user: huelager }: AccessTokenRequest,
  ): Promise<WalletTransaction[]> {
    return await this.transactionService.getWalletTransactions(huelager);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Transaction)
  async topUpHuenit(
    @Args('input') topupInput: TopupInput,
    @Context('req') { user: huelager }: AccessTokenRequest,
  ) {
    topupInput.entity = huelager;
    return await this.transactionService.topUp(topupInput);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Transaction)
  async withdrawHuenit(
    @Args('input') topupInput: TopupInput,
    @Context('req') { user: huelager }: AccessTokenRequest,
  ) {
    topupInput.entity = huelager;
    return await this.transactionService.withdrawal(topupInput);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Transaction)
  async transferHuenit(
    @Args('input') transferInput: TransferInput,
    @Context('req') { user: huelager }: AccessTokenRequest,
  ): Promise<Transaction> {
    transferInput.sender = huelager;

    return this.transactionService.transfer(transferInput);
  }
}
