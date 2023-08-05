import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
// @Unique(['email', 'phoneNumber'])
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column()
  @Field()
  email: string;

  @Column({ nullable: true, unique: true }) // it can be empty (the social signup).
  @Field({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true, unique: true }) // it can be empty (the social signup).
  password: string;

  @Column({ default: false }) // set to true for social signup
  @Field()
  isSocialAuth: boolean;

  @Field({ nullable: true })
  accessToken: string;

  @Column({ default: false }) // if phone number is verified it changes to true
  @Field((type) => Boolean)
  isVerified: boolean;

  @Column({ default: false })
  @Field((type) => Boolean)
  emailIsVerified: boolean;

  @Column({ nullable: true })
  phoneOtp: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: true })
  updatedAt: Date;
}
