import { CreateUserDto, CreateVendorDto } from './create-account.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType('UpdateUserType')
export class UpdateUserDto extends PartialType(CreateUserDto) {}

@InputType('UpdateVendorType')
export class UpdateVendorDto extends PartialType(CreateVendorDto) {}
