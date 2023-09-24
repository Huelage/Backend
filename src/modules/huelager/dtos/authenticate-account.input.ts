import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('AuthenticateEntityInput')
export class AuthenticateEntityInput {
  @IsString()
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
  @Field({ nullable: true })
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}

@InputType('AuthenticateVendorInput')
export class AuthenticateVendorInput extends AuthenticateEntityInput {
  @IsNotEmpty()
  @IsString()
  @Field({ nullable: true })
  vendorKey: string;
}
