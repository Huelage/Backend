import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType('AuthenticateEntityInput')
class AuthenticateEntityInput {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  entityId: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}

@InputType('AuthenticateUserInput')
export class AuthenticateUserInput extends AuthenticateEntityInput {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}

@InputType('AuthenticateVendorInput')
export class AuthenticateVendorInput extends AuthenticateEntityInput {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  vendorKey: string;
}
