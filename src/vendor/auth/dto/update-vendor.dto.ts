import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorDto } from './create-vendor.dto';
import { InputType } from '@nestjs/graphql';

@InputType('UpdateVendorType')
export class UpdateVendorDto extends PartialType(CreateVendorDto) {}
