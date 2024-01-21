import { InputType, Field } from '@nestjs/graphql';
import { Huelager } from '../../../modules/huelager/entities/huelager.entity';

@InputType()
export class WithdrawalInput {
  @Field()
  bankName: string;

  @Field()
  bankAccountNo: string;

  @Field()
  pgTransactionId: string;

  @Field()
  amount: number;

  entity: Huelager;
}
