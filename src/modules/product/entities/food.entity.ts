import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity';

export enum Availability {
  AVAILABLE = 'available',
  TEMPORARILY_UNAVAILABLE = 'temporarily_unavailable',
  UNAVAILABLE = 'unavailable',
}

export enum FoodCategory {
  SNACKS = 'snacks',
  DRINKS = 'drinks',
  PROTEIN = 'protein',
  CARBOHYDRATE = 'carbohydrate',
}

export enum FoodPricing {
  PRICE = 'price',
  PORTION = 'portion',
  PACKAGE = 'package',
  FIXED = 'fixed',
}

registerEnumType(Availability, { name: 'Availability' });
registerEnumType(FoodCategory, { name: 'FoodCategory' });
registerEnumType(FoodPricing, { name: 'FoodPricing' });

@ObjectType()
export class PackageSize {
  @Field()
  name: string;

  @Field()
  price: number;
}

@ObjectType()
export class Sides {
  @Field()
  description: string;

  // @Field()
  // options: { name: string; price: number }[];

  @Field()
  isRequired: boolean;

  @Field()
  isMultiple: boolean;
}

@Entity({ name: 'food' })
@ObjectType()
export class Food {
  @PrimaryColumn({ type: 'uuid', name: 'product_id' })
  @Field()
  productId: string;

  @OneToOne(() => Product, (product) => product.food, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  @Field(() => Product)
  product: Product;

  @Column({ type: 'enum', enum: FoodCategory })
  @Field(() => FoodCategory)
  category: FoodCategory;

  @Column({ type: 'enum', enum: FoodPricing, name: 'pricing_method' })
  @Field(() => FoodPricing)
  pricingMethod: FoodPricing;

  @Column({ name: 'price', type: 'decimal', nullable: true })
  @Field({ nullable: true })
  price: number;

  @Column({ name: 'preparation_time', type: 'text', nullable: true })
  @Field({ nullable: true })
  preparationTime: string;

  @Column({ type: 'enum', enum: Availability, default: Availability.AVAILABLE })
  @Field(() => Availability)
  availability: Availability;

  @Column({ name: 'package_sizes', type: 'json', nullable: true })
  @Field(() => [PackageSize], { nullable: true })
  packageSizes: PackageSize[];

  @Column({ type: 'json', nullable: true })
  @Field(() => [Sides], { nullable: true })
  sides: Sides[];
}
