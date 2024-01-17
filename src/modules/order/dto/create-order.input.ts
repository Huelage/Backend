import { InputType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { HuelagerType } from '../../../modules/huelager/entities/huelager.entity';
import { User } from '../../../modules/huelager/user/user.entity';
import { PaymentMethod, PaymentStatus } from '../entities/order.entity';
import { AddressInterface } from '../../../modules/huelager/dtos/create-account.input';

@InputType()
export class CreateOrderInput {
  @Field()
  vendorId: string;

  @Field(() => [OrderItemInput])
  orderItems: OrderItemInput[];

  @Field(() => GraphQLJSON)
  deliveryAddress: AddressInterface;

  @Field()
  deliveryFee: number;

  @Field()
  totalAmount: number;

  @Field({ nullable: true })
  pgTransactionId: string;

  @Field()
  discount: number;

  @Field()
  subtotal: number;

  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Field(() => PaymentStatus, { nullable: true })
  paymentStatus: PaymentStatus;

  @Field(() => [GraphQLJSON])
  paymentBreakdown: { name: string; amount: number }[];

  user: User;

  entityType: HuelagerType;
}

@InputType()
class OrderItemInput {
  @Field()
  itemId: string;

  @Field()
  productId: string;

  @Field()
  productName: string;

  @Field()
  totalPrice: number;

  @Field()
  quantity: number;

  @Field({ nullable: true })
  portion: number;

  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  size: string;

  @Field(() => GraphQLJSON, { nullable: true })
  extras: { name: string; price: number; quantity: number }[];
}
