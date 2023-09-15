import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  IsAlpha,
  MinLength,
  IsString,
} from 'class-validator';

import { MatchesWith } from '../../../common/decorators/matches-with.decorator';

@InputType('CreateEntityInput')
class CreateEntityDto {
  @IsEmail()
  @Field()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @Field()
  phone: string;

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

@InputType('CreateUserInput')
export class CreateUserDto extends CreateEntityDto {
  @IsAlpha()
  @Field()
  firstName: string;

  @IsAlpha()
  @Field()
  lastName: string;
}

@InputType('CreateVendorInput')
export class CreateVendorDto extends CreateEntityDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  repName: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  businessName: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  businessAddress: string;
}
