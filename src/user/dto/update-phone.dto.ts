import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdatePhoneDto {
  @IsString()
  @Field()
  phoneNumber: string;

  @IsString()
  @Field()
  email: string;
}
