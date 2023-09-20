import { InputType, Int, Field } from '@nestjs/graphql';
import {
  Availability,
  FoodCategory,
  FoodPricing,
} from '../entities/food.entity';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateFoodInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => FoodCategory)
  category: FoodCategory;
  @Field(() => FoodPricing)
  pricingMethod: FoodPricing;

  @Field({ nullable: true })
  portionPrice: number;

  @Field({ nullable: true })
  minPrice: number;

  @Field({ nullable: true })
  fixedPrice: number;

  @Field(() => Availability)
  availability: Availability;

  @Field(() => GraphQLJSON, { nullable: true })
  packagesSizes: any;

  @Field(() => GraphQLJSON, { nullable: true })
  sides: any;
}
