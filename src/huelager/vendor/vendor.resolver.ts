import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

import { VendorService } from './vendor.service';
import { Vendor } from './vendor.entity';
import { CreateVendorDto } from '../dtos/create-account.dto';
import { VerifyPhoneDto } from '../dtos/verify-phone.dto';
import { UpdatePhoneDto } from '../dtos/update-phone.dto';
import { AuthenticateVendorDto } from '../dtos/authenticate-account.dto';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { AuthService } from '../hulager.service';
import { Huelager } from '../entities/huelager.entity';

@Resolver()
export class VendorResolver {
  constructor(
    private vendorService: VendorService,
    private authService: AuthService,
  ) {}

  @Mutation(() => Vendor)
  async signUpVendor(
    @Args('input') createVendorDto: CreateVendorDto,
  ): Promise<Vendor> {
    return await this.vendorService.create(createVendorDto);
  }

  @Mutation(() => Vendor)
  async signInVendor(
    @Args('input') VendorenticateVendorDto: AuthenticateVendorDto,
  ): Promise<Vendor> {
    return await this.vendorService.signIn(VendorenticateVendorDto);
  }

  @Mutation(() => Huelager)
  async updateVendorPhone(
    @Args('input') updatePhoneDto: UpdatePhoneDto,
  ): Promise<Huelager> {
    return await this.vendorService.updatePhone(updatePhoneDto);
  }

  @Mutation(() => Huelager)
  async verifyVendorPhone(
    @Args('input') verifyPhoneDto: VerifyPhoneDto,
  ): Promise<Huelager> {
    return await this.vendorService.verifyPhone(verifyPhoneDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Mutation(() => String)
  async refreshVendorToken(@Context('req') req) {
    return await this.authService.refreshToken(req.user);
  }
}
