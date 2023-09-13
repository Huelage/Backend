import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './../common/guards/refresh-token.guard';
import { AuthService } from './hulager.service';
import { Huelager } from './entities/huelager.entity';
import { UpdatePhoneDto } from './dtos/update-phone.dto';
import { VerifyPhoneDto } from './dtos/verify-phone.dto';

@Resolver()
export class HuelagerResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => Huelager)
  async updatePhone(
    @Args('input') updatePhoneDto: UpdatePhoneDto,
  ): Promise<Huelager> {
    return await this.authService.updatePhone(updatePhoneDto);
  }

  @Mutation(() => Huelager)
  async verifyPhone(
    @Args('input') verifyPhoneDto: VerifyPhoneDto,
  ): Promise<Huelager> {
    return await this.authService.verifyPhone(verifyPhoneDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Mutation(() => String)
  async refreshToken(@Context('req') req) {
    return await this.authService.refreshToken(req.user);
  }

  @UseGuards()
  @Mutation(() => String)
  async generateRSAKey(@Context('req') req) {
    return await this.authService.generateRSAKey(req.user);
  }
}
