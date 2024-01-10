import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsString,
  IsJSON,
} from 'class-validator';

import { MatchesWith } from '../../../common/decorators/matches-with.decorator';
import GraphQLJSON from 'graphql-type-json';

export interface AddressInterface {
  name: string;
  locationId: string;
  geoLocation: { lat: number; lng: number };
  extraDetails?: string;
}

@InputType('CreateEntityInput')
class CreateEntityInput {
  @IsEmail()
  @Field()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @Field()
  phone: string;

  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password: string;

  @IsNotEmpty()
  @MatchesWith('password', {
    message: 'password and confirmPassword field do not match',
  })
  @Field()
  confirmPassword: string;
}

@InputType('CreateUserInput')
export class CreateUserInput extends CreateEntityInput {
  @IsString()
  @Field()
  firstName: string;

  @IsString()
  @Field()
  lastName: string;
}

@InputType('CreateVendorInput')
export class CreateVendorInput extends CreateEntityInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  repName: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  businessName: string;

  @IsNotEmpty()
  @IsJSON()
  @Field(() => GraphQLJSON)
  businessAddress: AddressInterface;
}
