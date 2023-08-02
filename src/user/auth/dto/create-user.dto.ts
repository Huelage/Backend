import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @Field()
  phoneNumber: string;

  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password: string;
}
