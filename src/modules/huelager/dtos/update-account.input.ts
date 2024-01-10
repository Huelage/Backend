import { Field, InputType } from '@nestjs/graphql';
import { IsJSON, IsString } from 'class-validator';
import { AddressInterface } from './create-account.input';
import GraphQLJSON from 'graphql-type-json';

@InputType('UpdateEntityInput')
class UpdateEntityInput {}

@InputType('UpdateUserInput')
export class UpdateUserInput {
  @IsString()
  @Field()
  firstName: string;

  @IsString()
  @Field()
  lastName: string;
}

@InputType('UpdateVendorInput')
export class UpdateVendorInput extends UpdateEntityInput {
  @IsString()
  @Field()
  businessName: string;

  @IsJSON()
  @Field(() => GraphQLJSON)
  businessAddress: AddressInterface;

  @IsString()
  @Field()
  repName: string;

  @IsString()
  @Field()
  openingHours: string;

  @IsString()
  @Field()
  closingHours: string;
}
