import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsAlpha, MinLength } from 'class-validator';

@InputType('CreateUserInput')
export class CreateUserDto {
  @IsAlpha()
  @Field()
  firstName: string;

  @IsAlpha()
  @Field()
  lastName: string;

  @IsEmail()
  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password: string;
}
