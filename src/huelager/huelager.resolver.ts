import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './../common/guards/refresh-token.guard';
import { HuelagerService } from './hulager.service';
import { Huelager } from './entities/huelager.entity';
import { UpdatePhoneDto } from './dtos/update-phone.dto';
import { VerifyPhoneDto } from './dtos/verify-phone.dto';
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
    @Args('input') updatePhoneDto: UpdatePhoneDto,
  ): Promise<Huelager> {
    return await this.huelagerService.updatePhone(updatePhoneDto);
  }

  @Mutation(() => Huelager)
  async verifyPhone(
    @Args('input') verifyPhoneDto: VerifyPhoneDto,
  ): Promise<Huelager> {
    return await this.huelagerService.verifyPhone(verifyPhoneDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Mutation(() => String)
  async refreshToken(@Context('req') req) {
    return await this.huelagerService.refreshToken(req.user);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => String)
  async generateRSAKey(@Context('req') req) {
    return await this.huelagerService.generateRSAKey(req.user);
  }
}
