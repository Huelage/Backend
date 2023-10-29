import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { HuelagerType } from '../../../modules/huelager/entities/huelager.entity';
import { User } from '../../../modules/huelager/user/user.entity';
import { PaymentMethod } from '../entities/order.entity';

@InputType()
export class CreateOrderInput {
  @IsString()
  @Field()
  vendorId: string;

  @Field(() => [OrderItemInput])
  orderItems: OrderItemInput[];

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  deliveryAddress: string;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  discount: number;

  @Field()
  @IsNumber()
  subtotal: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  user: User;

  entityType: HuelagerType;
}

@InputType()
class OrderItemInput {
  @IsString()
  @Field()
  itemId: string;

  @IsString()
  @Field()
  productId: string;

  @IsNumber()
  @Field()
  totalPrice: number;

  @IsNumber()
  @Field()
  quantity: number;

  @Field(() => GraphQLJSON, { nullable: true })
  extras: { name: string; price: number; quantity: number }[];
}
