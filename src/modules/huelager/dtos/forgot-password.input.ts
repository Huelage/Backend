import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType('ForgotPasswordInput')
export class ForgotPasswordInput {
  @IsString()
  @MinLength(8)
  @Field()
  password: string;

  @IsString()
  @Field()
  entityId: string;
}
