import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { HuelagerType } from '../entities/huelager.entity';

@InputType('EditUserLocationInput')
export class EditUserLocationInput {
  @IsString()
  @Field()
  locationId: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name: string;

  userId: string;

  entityType: HuelagerType;
}
