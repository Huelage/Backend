import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './huenit_wallet.entity';
import { Biometric } from './biometric.entity';

/**
 * The parameters decorated with the 'Field' decorator are the parametrers that will be returned as output for graphql.
 * The 'Column' decorator is for the database.
 */

export enum HuelagerType {
  VENDOR = 'vendor',
  USER = 'user',
}

@Entity({ name: 'entity' })
@ObjectType()
export class Huelager {
  @PrimaryGeneratedColumn('uuid', { name: 'entity_id' })
  @Field()
  entityId: string;

  @Field()
  @OneToOne(() => Wallet, (wallet) => wallet.entity)
  @JoinColumn()
  wallet: Wallet;

  @Column({ unique: true, type: 'varchar', length: 256 })
  @Field()
  email: string;

  @Column({ unique: true, type: 'varchar', length: 20 })
  @Field()
  phone: string;

  @Column({ type: 'varchar', length: 24 })
  password: string;

  @Column({ name: 'hashed_refresh_token', nullable: true })
  hashedRefreshToken: string;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Field()
  @Column({ name: 'email_is_verified', type: 'boolean', default: false })
  emailIsVerified: boolean;

  @Column({ name: 'phone_otp', nullable: true, type: 'smallint' })
  phoneOtp: string;

  @OneToMany(() => Biometric, (biometric) => biometric.entity)
  biometrics: Biometric[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Field()
  updatedAt: Date;

  @Column({
    name: 'entity_type',
    type: 'enum',
    enum: HuelagerType,
    default: HuelagerType.USER,
  })
  @Field()
  entityType: HuelagerType;

  @Column({ name: 'img_url', nullable: true, type: 'text' })
  @Field({ nullable: true })
  imgUrl: string;

  @Field({ nullable: true }) //this is strictly for graphql; not to be stopred in the database
  refreshToken: string;

  @Field({ nullable: true }) //this is strictly for graphql; not to be stopred in the database
  accessToken: string;
}
