import { InputType, PartialType } from '@nestjs/graphql';

import { CreateUserInput, CreateVendorInput } from './create-account.input';

@InputType('UpdateUserType')
export class UpdateUserInput extends PartialType(CreateUserInput) {}

@InputType('UpdateVendorType')
export class UpdateVendorInput extends PartialType(CreateVendorInput) {}
