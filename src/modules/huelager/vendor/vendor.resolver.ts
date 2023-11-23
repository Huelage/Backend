import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';

import { VendorService } from './vendor.service';
import { Vendor } from './vendor.entity';
import { CreateVendorInput } from '../dtos/create-account.input';
import { AuthenticateVendorInput } from '../dtos/authenticate-account.input';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../../common/guards/access-token.guard';
import { AccessTokenRequest } from '../../../common/interfaces/request.interface';

@Resolver()
export class VendorResolver {
  constructor(private vendorService: VendorService) {}

  @UseGuards(AccessTokenGuard)
  @Query(() => Vendor)
  async getMyVendorProfile(
    @Context('req') { user: huelager }: AccessTokenRequest,
  ) {
    return await this.vendorService.restructureHuelager(huelager);
  }

  @UseGuards(AccessTokenGuard)
  @Query(() => Vendor)
  async getVendorProfile(
    @Args('vendorId', { type: () => String }) vendorId: string,
  ) {
    return await this.vendorService.getVendor(vendorId);
  }

  @UseGuards(AccessTokenGuard)
  @Query(() => [Vendor])
  async getAllVendors(): Promise<Vendor[]> {
    return await this.vendorService.findAll();
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
