import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { User } from '../user/user.entity';
import { Vendor } from '../vendor/vendor.entity';
import GraphQLJSON from 'graphql-type-json';
import { AddressInterface } from './create-account.input';

@InputType()
class EditVendorParam {
  @Field(() => String)
  @IsIn(['imgUrl', 'businessName', 'repName', 'businessAddress'])
  prop: 'imgUrl' | 'businessName' | 'repName' | 'businessAddress';

  @Field(() => GraphQLJSON)
  value: string | AddressInterface;
}

@InputType('EditVendorProfileInput')
export class EditVendorProfileInput {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @Type(() => EditVendorParam)
  @Field(() => [EditVendorParam])
  parameters: EditVendorParam[];

  vendor: Vendor;
}

@InputType('EditUserProfileInput')
export class EditUserProfileInput {
  @Field()
  imgUrl: string;

  user: User;
}
