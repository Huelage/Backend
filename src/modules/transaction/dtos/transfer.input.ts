import { InputType, Field } from '@nestjs/graphql';
import { Length } from 'class-validator';

import { Huelager } from '../../../modules/huelager/entities/huelager.entity';

@InputType()
export class TransferInput {
  @Length(16, 16, { message: 'accountNumber must be 16 digits' })
  @Field()
  accountNumber: string;

  @Field()
  amount: number;

  sender: Huelager;
}
