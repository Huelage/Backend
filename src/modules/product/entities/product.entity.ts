import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { Vendor } from '../../huelager/vendor/vendor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Food } from './food.entity';
import { OrderItem } from '../../order/entities/order_item.entity';

enum ProductType {
  FOOD = 'food',
  BOOK = 'book',
  STATIONERY = 'stationery',
}

registerEnumType(ProductType, { name: 'ProductType' });

@Entity({ name: 'product' })
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid', { name: 'product_id' })
  @Field()
  productId: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendor_id' })
  @Field(() => Vendor)
  vendor: Vendor;

  @Column({ type: 'text' })
  @Field()
  name: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @Column({ type: 'text', name: 'img_url', nullable: true })
  @Field()
  imgUrl: string;

  @Column({ type: 'enum', enum: ProductType, default: ProductType.FOOD })
  @Field(() => ProductType)
  type: ProductType;

  @OneToOne(() => Food, (food) => food.product)
  @Field(() => Food)
  food: Food;

  @OneToOne(() => OrderItem, (orderItem) => orderItem.product)
  @Field(() => OrderItem)
  orderItem: OrderItem;
}
