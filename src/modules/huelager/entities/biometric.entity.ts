import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Huelager } from './huelager.entity';

@Entity({ name: 'biometric' })
@ObjectType()
export class Biometric {
  @PrimaryGeneratedColumn('uuid', { name: 'biometric_id' })
  @Field()
  biometricId: string;

  @ManyToOne(() => Huelager, (huelager) => huelager.biometrics, {
    onDelete: 'CASCADE',
  })
  @Field(() => Huelager)
  @JoinColumn({ name: 'entity_id' })
  entity: Huelager;

  @Column({ type: 'text' })
  @Field()
  key: string;
}

//penny and dime.
