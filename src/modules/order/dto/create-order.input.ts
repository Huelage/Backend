import { InputType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { HuelagerType } from '../../../modules/huelager/entities/huelager.entity';
import { User } from '../../../modules/huelager/user/user.entity';
import { PaymentMethod } from '../entities/order.entity';
import { AddressInterface } from 'src/modules/huelager/dtos/create-account.input';

@InputType()
export class CreateOrderInput {
  @Field()
  vendorId: string;

  @Field(() => [OrderItemInput])
  orderItems: OrderItemInput[];

  // @IsOptional()
  // @IsString()
  // @Field({ nullable: true })
  // deliveryAddress: string;

  // @IsOptional()
  // @IsNumber()
  // @Field({ nullable: true })
  // discount: number;

  @Field()
  subtotal: number;

  // @IsOptional()
  // @IsEnum(PaymentMethod)
  // @Field(() => PaymentMethod)
  // paymentMethod: PaymentMethod;

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
