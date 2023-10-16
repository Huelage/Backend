import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';

import { VendorService } from './vendor.service';
import { Vendor } from './vendor.entity';
import { CreateVendorInput } from '../dtos/create-account.input';
import { AuthenticateVendorInput } from '../dtos/authenticate-account.input';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../../common/guards/access-token.guard';
import { Huelager } from '../entities/huelager.entity';

@Resolver()
export class VendorResolver {
  constructor(private vendorService: VendorService) {}

  @UseGuards(AccessTokenGuard)
  @Query(() => Vendor)
  getVendorProfile(@Context('req') { user: huelager }: { user: Huelager }) {
    return this.vendorService.restructureHuelager(huelager);
  }

  @Mutation(() => Vendor)
  async signUpVendor(
    @Args('input') createVendorInput: CreateVendorInput,
  ): Promise<Vendor> {
    return await this.vendorService.create(createVendorInput);
  }

  @Mutation(() => Vendor)
  async signInVendor(
    @Args('input') authenticateVendorInput: AuthenticateVendorInput,
  ): Promise<Vendor> {
    return await this.vendorService.signIn(authenticateVendorInput);
  }
}
