import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { VendorService } from './vendor.service';
import { Vendor } from './vendor.entity';
import { CreateVendorDto } from '../dtos/create-account.dto';
import { AuthenticateVendorDto } from '../dtos/authenticate-account.dto';

@Resolver()
export class VendorResolver {
  constructor(private vendorService: VendorService) {}

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
}
