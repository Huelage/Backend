import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsEnum, IsString } from 'class-validator';
import { FoodCategory, FoodPricing } from '../entities/food.entity';
import GraphQLJSON from 'graphql-type-json';
import { Vendor } from '../../huelager/vendor/vendor.entity';
import { HuelagerType } from '../../huelager/entities/huelager.entity';

@InputType('CreateFoodInput')
export class CreateFoodInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  imgUrl: string;

  @Field(() => FoodCategory)
  @IsEnum(FoodCategory)
  category: FoodCategory;

  @Field(() => FoodPricing)
  @IsEnum(FoodPricing)
  pricingMethod: FoodPricing;

  @Field({ nullable: true })
  @IsNumber()
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
  @IsNumber()
  preparationTime: number;

  entityType: HuelagerType;

  vendor: Vendor;
}
