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
@Unique(['email', 'phoneNumber'])
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

  @Column({ nullable: true })
  @Field({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true }) // it can be empty (the social signup).
  password: string;

  @Column({ default: false }) // set to true for social signup
  @Field()
  isSocialAuth: boolean;

  @Column({ default: false }) // if phone number is verified it changes to true
  @Field((type) => Boolean)
  isVerified: boolean;

  @Column({ default: false })
  @Field((type) => Boolean)
  emailIsVerified: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
