import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Huelager } from './huelager.entity';

@Entity({ name: 'huenit_wallet' })
@ObjectType()
export class Wallet {
  @PrimaryGeneratedColumn('uuid', { name: 'wallet_id' })
  @Field()
  walletId: string;

  @OneToOne(() => Huelager, (huelager) => huelager.wallet)
  @Field(() => Huelager)
  entity: Huelager;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  @Field()
  balance: number;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  updatedAt: Date;
}

//penny and dime.
