import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Huelager } from './huelager.entity';

@Entity()
@ObjectType()
export class Biometric {
  @PrimaryGeneratedColumn('uuid', { name: 'biometric_id' })
  @Field()
  biometricId: string;

  @OneToOne(() => Huelager)
  @JoinColumn({ name: 'entity_id', referencedColumnName: 'entity_id' })
  entityId: string;

  @Column({ type: 'text' })
  @Field()
  key: string;
}

//penny and dime.
