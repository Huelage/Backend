import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { TopupInput } from './dtos/topup.input';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { AccessTokenRequest } from 'src/common/interfaces/request.interface';
import { TransferInput } from './dtos/transfer.input';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

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

    const { transaction, receiverWallet } =
      await this.transactionService.transfer(transferInput);

    pubSub.publish(`wallet-${receiverWallet.walletId}`, {
      walletBalanceUpdated: receiverWallet,
    });
    return transaction;
  }
}
