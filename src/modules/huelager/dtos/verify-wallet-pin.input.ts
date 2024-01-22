import { Field, InputType } from '@nestjs/graphql';
import { Huelager } from '../entities/huelager.entity';

@InputType('VerifyWalletPinInput')
export class VerifyWalletPinInput {
  @Field()
  pin: string;

  huelager: Huelager;
}
