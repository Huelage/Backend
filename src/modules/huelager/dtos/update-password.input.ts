import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { MatchesWith } from '../../../common/decorators/matches-with.decorator';

@InputType('UpdatePasswordInput')
export class UpdatePasswordInput {
  @IsString()
  @Field()
  entityId: string;

  @IsString()
  @Field()
  oldPassword: string;

  @IsString()
  @MinLength(8)
  @Field()
  password: string;

  @IsNotEmpty()
  @MatchesWith('password', {
    message: 'password and confirmPassword field do not match',
  })
  @Field()
  confirmPassword: string;
}
