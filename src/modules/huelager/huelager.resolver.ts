import {
  Resolver,
  Mutation,
  Args,
  Query,
  Context,
  Subscription,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { HuelagerService } from './huelager.service';
import { Huelager } from './entities/huelager.entity';
import { UpdatePhoneInput } from './dtos/update-phone.input';
import { VerifyPhoneInput } from './dtos/verify-phone.input';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { VerifyEmailInput } from './dtos/verify-email.input';
import { ForgotPasswordInput } from './dtos/forgot-password.input';
import { UpdatePasswordInput } from './dtos/update-password.input';
import {
  AccessTokenRequest,
  RefreshTokenRequest,
} from '../../common/interfaces/request.interface';
import { PubSub } from 'graphql-subscriptions';
import { Transaction } from '../transaction/entities/transaction.entity';
import { UpdateWalletPinInput } from './dtos/update-wallet-pin.input';
import { VerifyWalletPinInput } from './dtos/verify-wallet-pin.input';
import { Order } from '../order/entities/order.entity';

const pubSub = new PubSub();

@Resolver()
export class HuelagerResolver {
  constructor(private huelagerService: HuelagerService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @UseGuards(AccessTokenGuard)
  @Query(() => Huelager)
  getEntityProfile(@Context('req') { user: huelager }: AccessTokenRequest) {
    return huelager;
  }

  @Query(() => Huelager)
  async getAccountDetails(@Args('accountNumber') accountNumber: string) {
    return await this.huelagerService.huelagerFromAccountNumber(accountNumber);
  }

  /**
   *The refresh token strategy does not return the whole 'huelager' object like the access token
   * @param req
   * @returns accessToken-string
   */
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => String)
  async refreshAccessToken(@Context('req') { user }: RefreshTokenRequest) {
    const { refreshToken, entityId } = user;
    const refreshTokenDto = { refreshToken, entityId };

    return await this.huelagerService.refreshToken(refreshTokenDto);
  }

  @Mutation(() => Huelager)
  async updatePhone(
    @Args('input') updatePhoneInput: UpdatePhoneInput,
  ): Promise<Huelager> {
    return await this.huelagerService.updatePhone(updatePhoneInput);
  }

  @Mutation(() => Huelager)
  async verifyPhoneOtp(
    @Args('input') verifyPhoneInput: VerifyPhoneInput,
  ): Promise<Huelager> {
    return await this.huelagerService.verifyPhone(verifyPhoneInput);
  }

  @Mutation(() => Huelager)
  async requestEmailVerification(@Args('email') email: string) {
    return await this.huelagerService.requestEmailVerification(email);
  }

  @Mutation(() => Huelager)
  async verifyEmailOtp(@Args('input') verifyEmailInput: VerifyEmailInput) {
    return await this.huelagerService.verifyEmail(verifyEmailInput);
  }

  @Mutation(() => Huelager)
  async forgotPassword(
    @Args('input') forgotPasswordInput: ForgotPasswordInput,
  ) {
    return await this.huelagerService.forgotPassword(forgotPasswordInput);
  }

  @Mutation(() => Huelager)
  async updatePassword(
    @Args('input') updatePasswordInput: UpdatePasswordInput,
  ) {
    return await this.huelagerService.updatePassword(updatePasswordInput);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Huelager)
  async updateWalletPin(
    @Args('input') updateWalletPinInput: UpdateWalletPinInput,

    @Context('req') { user: huelager }: AccessTokenRequest,
  ) {
    updateWalletPinInput.huelager = huelager;
    return await this.huelagerService.updateWalletPin(updateWalletPinInput);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Boolean)
  async verifyWalletPin(
    @Args('input') verifyWalletPinInput: VerifyWalletPinInput,

    @Context('req') { user: huelager }: AccessTokenRequest,
  ) {
    verifyWalletPinInput.huelager = huelager;
    return await this.huelagerService.verifyWalletPin(verifyWalletPinInput);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => String)
  async generateRSAKey(@Context('req') { user: huelager }: AccessTokenRequest) {
    return await this.huelagerService.generateRSAKey(huelager);
  }

  @Subscription(() => Number)
  async walletBalanceUpdated(
    @Context('req') { connectionParams }: { connectionParams: any },
  ) {
    const { walletId } = await this.huelagerService.verifySubscriber(
      connectionParams,
    );

    return pubSub.asyncIterator(`wallet-${walletId}`);
  }

  @Subscription(() => Transaction)
  async transactionHistoryUpdated(
    @Context('req') { connectionParams }: { connectionParams: any },
  ) {
    const { entityId } = await this.huelagerService.verifySubscriber(
      connectionParams,
    );

    return pubSub.asyncIterator(`transaction-${entityId}`);
  }

  @Subscription(() => Order)
  async orderStatusUpdated(
    @Context('req') { connectionParams }: { connectionParams: any },
  ) {
    const { entityId } = await this.huelagerService.verifySubscriber(
      connectionParams,
    );

    return pubSub.asyncIterator(`order-${entityId}`);
  }

  @Subscription(() => Order)
  async newOrder(
    @Context('req') { connectionParams }: { connectionParams: any },
  ) {
    const { entityId } = await this.huelagerService.verifySubscriber(
      connectionParams,
    );

    return pubSub.asyncIterator(`order-new-${entityId}`);
  }
}

export { pubSub };
