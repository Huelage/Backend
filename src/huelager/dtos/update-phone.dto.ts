import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { HuelagerType } from '../entities/huelager.entity';

@InputType('UpdatePhoneInput')
export class UpdatePhoneDto {
  @IsString()
  @Field()
  phone: string;

  @IsString()
  @Field()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsEnum(HuelagerType)
  @Field(() => HuelagerType)
  entityType: HuelagerType;
}
