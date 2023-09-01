import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Huelager {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  entity_id: number;

  @Column()
  @Field()
  wallet_id: number;

  @Column()
  @Field()
  email: string;

  @Column({ unique: true })
  @Field({ nullable: true })
  phone?: string;

  @Column()
  password: string;

  @Column()
  @Field()
  hashed_refresh_token: string;

  @Column()
  is_verified: string;

  @Field({ nullable: true }) //this is not stored in the database.
  email_is_verified: string;

  @Field({ nullable: true }) //this is strictly for graphql; not to be stopred in the database
  refresh_token: string;

  @Column({ nullable: true })
  phone_otp: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: true })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: true })
  updated_at: Date;
}
