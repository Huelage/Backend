import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './huenit_wallet.entity';
import { Biometric } from './biometric.entity';
import { User } from '../user/user.entity';
import { Vendor } from '../vendor/vendor.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

/**
 * The parameters decorated with the 'Field' decorator are the parametrers that will be returned as output for graphql.
 * The 'Column' decorator is for the database.
 */

export enum HuelagerType {
  VENDOR = 'vendor',
  USER = 'user',
}
registerEnumType(HuelagerType, { name: 'HuelagerType' });

@Entity({ name: 'entity' })
@ObjectType()
export class Huelager {
  @PrimaryGeneratedColumn('uuid', { name: 'entity_id' })
  @Field()
  entityId: string;

  @OneToOne(() => Wallet, (wallet) => wallet.entity)
  @Field(() => Wallet)
  wallet: Wallet;

  @Column({ unique: true, type: 'varchar', length: 256 })
  @Field()
  email: string;

  @Column({ unique: true, type: 'varchar', length: 20 })
  @Field()
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'hashed_refresh_token', nullable: true })
  hashedRefreshToken: string;

  @Column({ name: 'is_phone_verified', type: 'boolean', default: false })
  @Field()
  isPhoneVerified: boolean;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  @Field()
  isEmailVerified: boolean;

  @Column({ name: 'otp', nullable: true, type: 'smallint' })
  otp: number;

  @OneToMany(() => Biometric, (biometric) => biometric.entity)
  biometrics: Biometric[];

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  updatedAt: Date;

  @Column({
    name: 'entity_type',
    type: 'enum',
    enum: HuelagerType,
    default: HuelagerType.USER,
  })
  @Field(() => HuelagerType)
  entityType: HuelagerType;

  @Column({ name: 'img_url', nullable: true, type: 'text' })
  @Field({ nullable: true })
  imgUrl: string;

  @Field({ nullable: true }) //this is strictly for graphql; not to be stopred in the database
  refreshToken: string;

  @Field({ nullable: true }) //this is strictly for graphql; not to be stopred in the database
  accessToken: string;

  @OneToOne(() => User, (user) => user.entity)
  @Field(() => User, { nullable: true })
  user: User;

  @OneToOne(() => Vendor, (vendor) => vendor.entity)
  @Field(() => Vendor, { nullable: true })
  vendor: Vendor;

  @OneToMany(() => Transaction, (transaction) => transaction.initiatorEntity)
  transactions: Transaction[];
}
