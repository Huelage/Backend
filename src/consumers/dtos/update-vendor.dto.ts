import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorDto } from '../vendor/auth/dto/create-vendor.dto';
import { InputType } from '@nestjs/graphql';

@InputType('UpdateVendorType')
export class UpdateVendorDto extends PartialType(CreateVendorDto) {}
