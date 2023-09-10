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
  @Field()
  entity: Huelager;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  @Field()
  balance: number;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Field()
  updatedAt: Date;
}

//penny and dime.
