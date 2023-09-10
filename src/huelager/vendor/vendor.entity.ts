import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Huelager } from '../entities/huelager.entity';

@Entity({ name: 'vendor' })
@ObjectType()
export class Vendor {
  @PrimaryColumn({ type: 'uuid', name: 'entity_id' })
  entityId: string;

  @OneToOne(() => Huelager)
  @Field(() => Huelager)
  @JoinColumn()
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

  @Column({ name: 'vendor_id', type: 'uuid' })
  @Field()
  vendorId: string;

  @Column({ name: 'opening_hours', type: 'time', nullable: true })
  @Field()
  openingHours: Date;

  @Column({ name: 'closing_hours', type: 'time', nullable: true })
  @Field()
  closingHours: Date;
}
