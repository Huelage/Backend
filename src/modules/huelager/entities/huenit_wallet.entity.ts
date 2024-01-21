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
export class Wallet {
  @PrimaryGeneratedColumn('uuid', { name: 'wallet_id' })
  @Field()
  walletId: string;

  @Column({ type: 'varchar', length: 16 }) // I will have to make it unique later
  @Field()
  accountNumber: string;

  @OneToOne(() => Huelager, (huelager) => huelager.wallet, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entity_id' })
  @Field(() => Huelager)
  entity: Huelager;

  @Column({ type: 'varchar', length: 255 })
  walletPin: string;

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
