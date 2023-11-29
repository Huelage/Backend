import { Field, InputType } from '@nestjs/graphql';
import { FoodCategory, FoodPricing } from '../entities/food.entity';
import GraphQLJSON from 'graphql-type-json';
import { Vendor } from '../../huelager/vendor/vendor.entity';
import { HuelagerType } from '../../huelager/entities/huelager.entity';

@InputType('CreateFoodInput')
export class CreateFoodInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  imgUrl: string;

  @Field(() => FoodCategory)
  category: FoodCategory;

  @Field(() => FoodPricing)
  pricingMethod: FoodPricing;

  @Field({ nullable: true })
  price: number;

  @Field(() => [GraphQLJSON], { nullable: true })
  sides: {
    description: string;
    options: { name: string; price: number }[];
    isRequired: boolean;
    isMultiple: boolean;
  }[];

  @Field(() => [GraphQLJSON], { nullable: true })
  packageSizes: { name: string; price: number }[];

  @Field({ nullable: true })
  preparationTime: number;

  entityType: HuelagerType;

  vendor: Vendor;
}
