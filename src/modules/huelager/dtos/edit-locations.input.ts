import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
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

  @IsOptional()
  @Field(() => GraphQLJSON, { nullable: true })
  geoLocation: { lat: number; lng: number };

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  extraDetails: string;

  userId: string;

  entityType: HuelagerType;
}
