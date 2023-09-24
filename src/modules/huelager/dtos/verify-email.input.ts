import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType('VerifyEmailInput')
export class VerifyEmailInput {
  @IsString()
  @Field()
  email: string;

  @IsNumber()
  @Field()
  otp: number;
}
