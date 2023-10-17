import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

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
import { CustomRequest } from '../../common/interfaces/request.interface';

@Resolver()
export class HuelagerResolver {
  constructor(private huelagerService: HuelagerService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @UseGuards(AccessTokenGuard)
  @Query(() => Huelager)
  getEntityProfile(@Context('req') { user: huelager }: CustomRequest) {
    return huelager;
  }

  /**
   *The refresh token strategy does not return the whole 'huelager' object like the access token
   * @param req
   * @returns accessToken-string
   */
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => String)
  async refreshAccessToken(@Context('req') { user: huelager }: CustomRequest) {
    return await this.huelagerService.refreshToken(huelager);
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
  @Mutation(() => String)
  async generateRSAKey(@Context('req') { user: huelager }: CustomRequest) {
    return await this.huelagerService.generateRSAKey(huelager);
  }
}
