import { InputType, PartialType } from '@nestjs/graphql';

import { CreateUserDto, CreateVendorDto } from './create-account.dto';

@InputType('UpdateUserType')
export class UpdateUserDto extends PartialType(CreateUserDto) {}

@InputType('UpdateVendorType')
export class UpdateVendorDto extends PartialType(CreateVendorDto) {}
