import { Resolver, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { AccessTokenRequest } from 'src/common/interfaces/request.interface';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Order)
  createOrder(
    @Args('input') createOrderInput: CreateOrderInput,
    @Context('req') { user: huelager }: AccessTokenRequest,
  ) {
    const { user, entityType } = huelager;
    createOrderInput = { ...createOrderInput, user, entityType };

    return this.orderService.create(createOrderInput);
  }
}
