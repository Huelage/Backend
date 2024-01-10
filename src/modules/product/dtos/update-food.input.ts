import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateFoodInput } from './create-food.input';
import { IsOptional, IsString } from 'class-validator';
import { Availability } from '../entities/food.entity';

@InputType('UpdateFoodInput')
export class UpdateFoodInput extends PartialType(CreateFoodInput) {
  @IsString()
  @Field()
  productId: string;

  @IsOptional()
  @Field(() => Availability)
  availability: Availability;
}
