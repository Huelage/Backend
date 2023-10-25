import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { AccessTokenRequest } from '../../common/interfaces/request.interface';
import { FindOrderDto } from './dto/find-order.dto';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Order)
  async createOrder(
    @Args('input') createOrderInput: CreateOrderInput,
    @Context('req') { user: huelager }: AccessTokenRequest,
  ) {
    const { user, entityType } = huelager;
    createOrderInput = { ...createOrderInput, user, entityType };

    return await this.orderService.create(createOrderInput);
  }

  @UseGuards(AccessTokenGuard)
  @Query(() => Order)
  async findOrder(
    @Args('orderId', { type: () => String }) orderId: string,
    @Context('req') { user: huelager }: AccessTokenRequest,
  ) {
    const findOrderDto: FindOrderDto = { orderId, entityId: huelager.entityId };
    return await this.orderService.findOne(findOrderDto);
  }
}
