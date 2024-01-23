import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType('AccountDetailInput')
export class AccountDetailInput {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  accountNumber: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  walletId: string;
}
