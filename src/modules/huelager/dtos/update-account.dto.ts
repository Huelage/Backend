import { InputType, PartialType } from '@nestjs/graphql';

import { CreateUserInput, CreateVendorInput } from './create-account.dto';

@InputType('UpdateUserType')
export class UpdateUserDto extends PartialType(CreateUserInput) {}

@InputType('UpdateVendorType')
export class UpdateVendorDto extends PartialType(CreateVendorInput) {}
