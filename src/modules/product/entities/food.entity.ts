import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity';
import { GraphQLJSON } from 'graphql-type-json';

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

@Entity({ name: 'food' })
@ObjectType()
export class Food {
  @PrimaryColumn({ type: 'uuid', name: 'product_id' })
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

  @Column({ type: 'enum', enum: Availability, default: Availability.AVAILABLE })
  @Field(() => Availability)
  availability: Availability;

  @Column({ name: 'package_sizes', type: 'json', nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  packagesSizes: any;

  @Column({ type: 'json', nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  sides: any;
}
