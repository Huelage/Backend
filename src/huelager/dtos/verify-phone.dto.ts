import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { HuelagerType } from '../entities/huelager.entity';

@InputType('VerifyPhoneInput')
export class VerifyPhoneDto {
  @IsString()
  @Field()
  phone: string;

  @IsString()
  @Field()
  phoneOtp: string;

  @IsEnum(HuelagerType)
  @Field(() => HuelagerType)
  entityType: HuelagerType;
}
