import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsEnum, IsString } from 'class-validator';

import { FoodCategory, FoodPricing } from '../entities/food.entity';
import { Vendor } from '../../huelager/vendor/vendor.entity';
import { HuelagerType } from '../../huelager/entities/huelager.entity';

@InputType()
export class SidesInput {
  @Field()
  description: string;

  // @Field()
  // options: { name: string; price: number }[];

  @Field()
  isRequired: boolean;

  @Field()
  isMultiple: boolean;
}
@InputType()
export class PackageSizeInput {
  @Field()
  name: string;

  @Field()
  price: number;
}

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
  imageUrl: string;

  @Field(() => FoodCategory)
  @IsEnum(FoodCategory)
  category: FoodCategory;

  @Field(() => FoodPricing)
  @IsEnum(FoodPricing)
  pricingMethod: FoodPricing;

  @Field({ nullable: true })
  @IsNumber()
  price: number;

  @Field(() => [SidesInput], { nullable: true })
  sides: SidesInput[];

  @Field(() => [PackageSizeInput], { nullable: true })
  packageSizes: PackageSizeInput[];

  entityType: HuelagerType;

  vendor: Vendor;
}
