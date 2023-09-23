import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

@InputType('UpdatePhoneInput')
export class UpdatePhoneInput {
  @IsString()
  @Field()
  phone: string;

  @IsString()
  @Field()
  @Transform(({ value }) => value.toLowerCase())
  entityId: string;
}
