import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';

import { VendorService } from './vendor.service';
import { Vendor } from './vendor.entity';
import { CreateVendorInput } from '../dtos/create-account.input';
import { AuthenticateVendorInput } from '../dtos/authenticate-account.input';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { UpdateVendorInput } from '../dtos/update-account.input';

@Resolver()
export class VendorResolver {
  constructor(private vendorService: VendorService) {}

  @UseGuards(AccessTokenGuard)
  @Query(() => Vendor)
  getVendorProfile(@Context('req') req) {
    return this.vendorService.restructureHuelager(req.user);
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

  @UseGuards(AccessTokenGuard)
  @Mutation(() => String)
  async updateVendorProfile(
    @Context('req') req,
    @Args('input') updateVendorInput: UpdateVendorInput,
  ) {
    return await this.vendorService.updateUserProfile(
      updateVendorInput,
      req.user,
    );
  }
}
