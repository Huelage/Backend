import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateFoodInput } from './create-food.input';
import { IsString } from 'class-validator';

@InputType('UpdateFoodInput')
export class UpdateFoodInput extends PartialType(CreateFoodInput) {
  @IsString()
  @Field()
  productId: string;
}
