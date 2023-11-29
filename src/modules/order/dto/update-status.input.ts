import { Field, InputType } from '@nestjs/graphql';
import { OrderStatus } from '../entities/order.entity';
import { HuelagerType } from '../../../modules/huelager/entities/huelager.entity';

@InputType()
export class UpdateOrderStatusInput {
  @Field()
  orderId: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  entityType: HuelagerType;

  entityId: string;
}
