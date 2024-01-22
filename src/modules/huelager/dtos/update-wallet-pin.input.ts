import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { Huelager } from '../entities/huelager.entity';

@InputType('UpdateWalletPinInput')
export class UpdateWalletPinInput {
  @Length(4, 4, { message: 'The pin should be four digits' })
  @Field()
  pin: string;

  huelager: Huelager;
}
