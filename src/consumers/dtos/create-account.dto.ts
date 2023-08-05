import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  IsAlpha,
  MinLength,
  IsString,
} from 'class-validator';

import { MatchesWith } from '../../common/decorators/matches-with.decorator';

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

  @IsNotEmpty()
  @MatchesWith('password', {
    message: 'password and confirmPassword field do not match',
  })
  @Field()
  confirmPassword: string;
}

@InputType('CreateVendorInput')
export class CreateVendorDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  businessName: string;
}
