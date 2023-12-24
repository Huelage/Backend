import { Field, InputType } from '@nestjs/graphql';
import { Vendor } from '../vendor/vendor.entity';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../user/user.entity';

@InputType()
class EditVendorParam {
  @Field(() => String)
  @IsIn(['imgUrl', 'businessName', 'repName', 'businessAddress'])
  prop: 'imgUrl' | 'businessName' | 'repName' | 'businessAddress';

  @Field(() => String)
  value: string;
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
