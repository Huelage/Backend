import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Huelager } from '../entities/huelager.entity';

@Entity()
@ObjectType()
export class Vendor {
  @OneToOne(() => Huelager)
  @JoinColumn({ name: 'entity_id', referencedColumnName: 'entity_id' })
  entityId: string;

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
}
