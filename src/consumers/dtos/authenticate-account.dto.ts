import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

@InputType('AuthenticateUserInput')
export class AuthenticateUserDto {
  @IsString()
  @Field()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @Field()
  password: string;
}

@InputType('AuthenticateVendorInput')
export class AuthenticateVendorDto extends AuthenticateUserDto {}
