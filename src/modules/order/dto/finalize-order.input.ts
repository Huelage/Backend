import { InputType, Field } from '@nestjs/graphql';
import { HuelagerType } from '../../../modules/huelager/entities/huelager.entity';
import { Vendor } from '../../../modules/huelager/vendor/vendor.entity';
import { PaymentMethod } from '../entities/order.entity';

@InputType()
export class FinalizeOrderInput {
  @Field()
  orderId: string;

  @Field()
  deliveryAddress: string;

  @Field()
  discount: number;

  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  vendor: Vendor;

  entityType: HuelagerType;
}
