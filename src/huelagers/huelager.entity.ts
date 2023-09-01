import { Field, Int, ObjectType } from '@nestjs/graphql';
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

  @Column({ unique: true })
  @Field()
  phone: string;

  @Column({ type: 'varchar', length: 24 })
  password: string;

  @Column({ name: 'hashed_refresh_token' })
  hashedRefreshToken: string;

  @Column({ name: 'is_verified', type: 'boolean' })
  isVerified: boolean;

  @Field()
  @Column({ name: 'email_is_verified', type: 'boolean', default: false })
  emailIsVerified: boolean;

  @Column({ name: 'phone_otp', nullable: true, type: 'smallint', length: 4 })
  phoneOtp: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ name: 'updated_at' })
  updatedAt: Date;

  @Field({ nullable: true }) //this is strictly for graphql; not to be stopred in the database
  refreshToken: string;
}
