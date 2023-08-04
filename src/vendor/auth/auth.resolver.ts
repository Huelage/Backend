import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Vendor } from '../vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { VerifyPhoneDto } from '../../user/auth/dto/verify-phone.dto';
import { UpdatePhoneDto } from '../../user/auth/dto/update-phone.dto';
import { AuthenticateVendorDto } from './dto/authenticate-vendor.dto';

@Resolver()
export class AuthResolver {
  constructor(private vendorService: AuthService) {}

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
    @Args('input') authenticateVendorDto: AuthenticateVendorDto,
  ): Promise<Vendor> {
    return await this.vendorService.signIn(authenticateVendorDto);
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
