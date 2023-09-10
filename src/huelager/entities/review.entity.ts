import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vendor } from '../vendor/vendor.entity';
import { User } from '../user/user.entity';

enum Rating {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}
registerEnumType(Rating);

@Entity({ name: 'huenit_wallet' })
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn('uuid', { name: 'review_id' })
  @Field()
  reviewId: string;

  @OneToOne(() => Vendor)
  @JoinColumn()
  vendorId: Vendor;

  @OneToOne(() => User)
  @JoinColumn()
  userId: User;

  @Column({ type: 'enum', enum: Rating })
  @Field(() => Rating)
  rating: Rating;

  @CreateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  date: Date;

  @Column({ type: 'text' })
  @Field()
  message: string;
}

//penny and dime.
