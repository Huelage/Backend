import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Vendor } from '../huelager/vendor/vendor.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

enum ProductType {
  FOOD = 'food',
  BOOK = 'book',
  STATIONERY = 'stationery',
}

registerEnumType(ProductType);

@Entity({ name: 'product' })
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid', { name: 'product_id' })
  @Field()
  productId: string;

  @OneToOne(() => Vendor)
  @Field(() => Vendor)
  vendor: Vendor;

  @Column({ type: 'text' })
  @Field()
  name: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @Column({ type: 'text', name: 'img_url' })
  @Field()
  imgUrl: string;

  @Column({ type: 'enum', enum: ProductType, default: ProductType.FOOD })
  @Field(() => ProductType)
  type: ProductType;
}
