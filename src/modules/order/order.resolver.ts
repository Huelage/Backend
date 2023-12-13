import {
  Resolver,
  Mutation,
  Args,
  Query,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { AccessTokenRequest } from '../../common/interfaces/request.interface';
import { FindOrderDto } from './dto/find-order.dto';
import { UpdateOrderStatusInput } from './dto/update-status.input';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

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
    const foundUser = await this.orderService.findOne(findOrderDto);
    pubSub.publish('orderSearch', { orderSearch: foundUser });
    return foundUser;
  }

  @UseGuards(AccessTokenGuard)
  @Query(() => [Order])
  async findUserOrders(@Context('req') { user: huelager }: AccessTokenRequest) {
    const { entityId, entityType } = huelager;
    return await this.orderService.findUserOrders(entityType, entityId);
  }

  @UseGuards(AccessTokenGuard)
  @Query(() => [Order])
  async findVendorOrders(
    @Context('req') { user: huelager }: AccessTokenRequest,
  ) {
    const { entityId, entityType } = huelager;
    return await this.orderService.findVendorOrders(entityType, entityId);
  }

  @UseGuards(AccessTokenGuard)
  @Query(() => [Order])
  async updateOrderStatus(
    @Args('input') updateOrderStatusInput: UpdateOrderStatusInput,
    @Context('req') { user: huelager }: AccessTokenRequest,
  ) {
    const { entityType, entityId } = huelager;
    updateOrderStatusInput = {
      ...updateOrderStatusInput,
      entityType,
      entityId,
    };
    return await this.orderService.updateOrderStatus(updateOrderStatusInput);
  }

  @Subscription(() => Order)
  @UseGuards(AccessTokenGuard)
  orderSearch() {
    console.log('penny and dime.');

    const toReturn = pubSub.asyncIterator('orderSearch');

    return toReturn;
  }
}
