import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

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

  @IsString()
  @Field()
  businessAddress: string;

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
