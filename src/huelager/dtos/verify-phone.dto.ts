import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType('VerifyPhoneInput')
export class VerifyPhoneDto {
  @IsString()
  @Field()
  phone: string;

  @IsNumber()
  @Field()
  phoneOtp: number;
}
