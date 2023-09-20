import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { VendorService } from './vendor.service';
import { Vendor } from './vendor.entity';
import { CreateVendorInput } from '../dtos/create-account.input';
import { AuthenticateVendorInput } from '../dtos/authenticate-account.input';

@Resolver()
export class VendorResolver {
  constructor(private vendorService: VendorService) {}

  @Mutation(() => Vendor)
  async signUpVendor(
    @Args('input') createVendorDto: CreateVendorInput,
  ): Promise<Vendor> {
    return await this.vendorService.create(createVendorDto);
  }

  @Mutation(() => Vendor)
  async signInVendor(
    @Args('input') VendorenticateVendorDto: AuthenticateVendorInput,
  ): Promise<Vendor> {
    return await this.vendorService.signIn(VendorenticateVendorDto);
  }
}
