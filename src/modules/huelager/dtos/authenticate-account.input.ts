import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType('AuthenticateEntityInput')
class AuthenticateEntityInput {
  @IsString()
  @IsOptional()
  @Field({
    nullable: true,
    description: 'The entity ID is the ID of the user or vendor.',
  })
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
  @Field({
    nullable: true,
    description: 'If the entity if is not sent then the email must be.',
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}

@InputType('AuthenticateVendorInput')
export class AuthenticateVendorInput extends AuthenticateEntityInput {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Field({
    nullable: true,
    description: 'If the entity if is not sent then the vendorKey must be.',
  })
  vendorKey: string;
}
