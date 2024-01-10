import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Huelager } from '../entities/huelager.entity';
import { Review } from '../entities/review.entity';
import { Product } from '../../product/entities/product.entity';
import { Order } from '../../order/entities/order.entity';
import { AddressInterface } from '../dtos/create-account.input';
import GraphQLJSON from 'graphql-type-json';

@Entity({ name: 'vendor' })
@ObjectType()
export class Vendor {
  @PrimaryColumn({ type: 'uuid', name: 'entity_id' })
  @Field()
  vendorId: string;

  @Column({ name: 'vendor_key', type: 'char', length: 8, unique: true })
  vendorKey: string;

  @OneToOne(() => Huelager, (huelager) => huelager.vendor, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entity_id' })
  @Field(() => Huelager)
  entity: Huelager;

  @Column({ name: 'business_name', type: 'varchar', length: 256 })
  @Field()
  businessName: string;

  @Column({ name: 'business_addr', type: 'json' })
  @Field(() => GraphQLJSON)
  businessAddress: AddressInterface;

  @Column({ name: 'rep_name', type: 'text' })
  @Field()
  repName: string;

  @Column({ name: 'avg_response_time', type: 'int', default: 0 })
  @Field()
  avgResponseTime: number;

  @Column({ name: 'opening_hours', type: 'text', nullable: true })
  @Field()
  openingHours: string;

  @Column({ name: 'closing_hours', type: 'text', nullable: true })
  @Field()
  closingHours: string;

  @Column({ name: 'rating', type: 'decimal', default: 0 })
  @Field()
  rating: number;

  @OneToMany(() => Review, (review) => review.vendor)
  @Field(() => [Review])
  reviews: Review[];

  @OneToMany(() => Product, (product) => product.vendor)
  @Field(() => [Product])
  products: Product[];

  @OneToMany(() => Order, (order) => order.vendor)
  @Field(() => [Order])
  orders: Order[];
}
