import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Vendor {
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
  businessName: string;

  @Unique(['email'])
  @Column()
  @Field()
  email: string;

  @Unique(['phoneNumber'])
  @Column({ nullable: true })
  @Field({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true }) // it can be empty (the social signup).
  password: string;

  @Column({ default: 'penny and dime.' })
  vendorId: string;

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
