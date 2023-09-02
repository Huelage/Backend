import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Huelager } from './huelager.entity';

@Entity({ name: 'huenit_wallet' })
@ObjectType()
export class Biometric {
  @PrimaryGeneratedColumn('uuid', { name: 'wallet_id' })
  @Field()
  walletId: string;

  @OneToOne(() => Huelager)
  @JoinColumn({ name: 'entity_id', referencedColumnName: 'entity_id' })
  entityId: string;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  @Field()
  balamce: number;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  updatedAt: Date;
}

//penny and dime.
