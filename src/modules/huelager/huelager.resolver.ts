import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { HuelagerService } from './hulager.service';
import { Huelager } from './entities/huelager.entity';
import { UpdatePhoneInput } from './dtos/update-phone.input';
import { VerifyPhoneInput } from './dtos/verify-phone.input';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

@Resolver()
export class HuelagerResolver {
  constructor(private huelagerService: HuelagerService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => Huelager)
  async updatePhone(
    @Args('input') updatePhoneDto: UpdatePhoneInput,
  ): Promise<Huelager> {
    return await this.huelagerService.updatePhone(updatePhoneDto);
  }

  @Mutation(() => Huelager)
  async verifyPhone(
    @Args('input') verifyPhoneDto: VerifyPhoneInput,
  ): Promise<Huelager> {
    return await this.huelagerService.verifyPhone(verifyPhoneDto);
  }

  /**
   *The refresh token strategy does not return the whole 'huelager' object like the access token
   * @param req
   * @returns accessToken-string
   */
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => String)
  async refreshAccessToken(@Context('req') req) {
    return await this.huelagerService.refreshToken(req.user);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => String)
  async generateRSAKey(@Context('req') req) {
    return await this.huelagerService.generateRSAKey(req.user);
  }
}
