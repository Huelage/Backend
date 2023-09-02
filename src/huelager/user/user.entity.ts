import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Huelager } from '../entities/huelager.entity';

@Entity({ name: 'user' })
@ObjectType()
export class User {
  @OneToOne(() => Huelager)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'entity_id' })
  userId: string;

  @Column({ name: 'first_name', type: 'varchar', length: 30 })
  @Field()
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 30 })
  @Field()
  lastName: string;

  @Column({ name: 'delivery_addr', type: 'text' })
  @Field()
  deliveryAddress: string;

  @Column({ name: 'is_social_auth', type: 'boolean', default: false })
  @Field()
  isSocialAuth: boolean;
}
