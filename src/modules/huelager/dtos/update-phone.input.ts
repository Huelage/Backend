import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType('UpdatePhoneInput')
export class UpdatePhoneInput {
  @IsString()
  @Field()
  phone: string;

  @IsString()
  @Field()
  entityId: string;
}
