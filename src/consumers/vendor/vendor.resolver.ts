import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.entity';
import { CreateVendorDto } from '../dtos/create-user.dto';
import { VerifyPhoneDto } from '../dtos/verify-phone.dto';
import { UpdatePhoneDto } from '../dtos/update-phone.dto';
import { AuthenticateVendorDto } from '../dtos/authenticate-user.dto';

@Resolver()
export class VendorResolver {
  constructor(private vendorService: VendorService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

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

  @Mutation(() => Vendor)
  async updatePhone(
    @Args('input') updatePhoneDto: UpdatePhoneDto,
  ): Promise<Vendor> {
    return await this.vendorService.updatePhone(updatePhoneDto);
  }

  @Mutation(() => Vendor)
  async verifyPhone(
    @Args('input') verifyPhoneDto: VerifyPhoneDto,
  ): Promise<Vendor> {
    return await this.vendorService.verifyPhone(verifyPhoneDto);
  }
}
