import { InputType, Field } from '@nestjs/graphql';
import { Huelager } from '../../../modules/huelager/entities/huelager.entity';

@InputType()
export class TopupInput {
  @Field()
  pgTransactionId: string;

  @Field()
  amount: number;

  entity: Huelager;
}
