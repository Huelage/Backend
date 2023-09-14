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
import { Product } from '../other_entities/product.entity';
import { Order } from '../other_entities/order/order.entity';

@Entity({ name: 'vendor' })
@ObjectType()
export class Vendor {
  @PrimaryColumn({ type: 'uuid', name: 'entity_id' })
  entityId: string;

  @OneToOne(() => Huelager, (huelager) => huelager.vendor, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entity_id' })
  @Field(() => Huelager)
  entity: Huelager;

  @Column({ name: 'business_name', type: 'varchar', length: 256 })
  @Field()
  businessName: string;

  @Column({ name: 'business_addr', type: 'text' })
  @Field()
  businessAddress: string;

  @Column({ name: 'rep_name', type: 'text' })
  @Field()
  repName: string;

  @Column({ name: 'opening_hours', type: 'time', nullable: true })
  @Field()
  openingHours: Date;

  @Column({ name: 'closing_hours', type: 'time', nullable: true })
  @Field()
  closingHours: Date;

  @OneToMany(() => Review, (review) => review.vendor)
  @Field(() => Review)
  reviews: Review[];

  @OneToMany(() => Product, (product) => product.vendor)
  @Field(() => Product)
  products: Product[];

  @OneToMany(() => Order, (order) => order.vendor)
  @Field(() => Order)
  orders: Order[];
}
