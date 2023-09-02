import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * The parameters decorated with the 'Field' decorator are the parametrers that will be returned as output for graphql.
 * The 'Column' decorator is for the database.
 */

export enum HuelagerType {
  VENDOR = 'vendor',
  USER = 'user',
}

@Entity({ name: 'Entity' })
@ObjectType()
export class Huelager {
  @PrimaryGeneratedColumn('uuid', { name: 'entity_id' })
  @Field()
  entityId: string;

  @Column({ name: 'wallet_id' }) /***** */
  @Field()
  walletId: string;

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

  @Column({ name: 'phone_otp', nullable: true, type: 'smallint', length: 4 })
  phoneOtp: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
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
  @Field()
  entityType: HuelagerType;

  @Column({ name: 'img_url', nullable: true, type: 'text' })
  @Field({ nullable: true })
  imgUrl: string;

  @Field({ nullable: true }) //this is strictly for graphql; not to be stopred in the database
  refreshToken: string;
}
