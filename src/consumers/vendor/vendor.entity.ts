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

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ unique: true })
  @Field({ nullable: true })
  phoneNumber?: string;

  @Column()
  password: string;

  @Column({ default: 'penny and dime.' })
  vendorId: string;

  @Field({ nullable: true }) //this is not stored in the database.
  accessToken: string;

  @Column({ nullable: true })
  @Field({ nullable: true }) //this is stored in the database.
  refreshToken: string;

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
