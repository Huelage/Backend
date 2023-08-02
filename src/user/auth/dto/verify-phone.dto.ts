import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType('VerifyPhoneInput')
export class VerifyPhoneDto {
  @IsString()
  @Field()
  phoneNumber: string;

  @IsString()
  @Field()
  phoneOtp: string;
}
