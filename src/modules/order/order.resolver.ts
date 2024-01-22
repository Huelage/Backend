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
import { CalculateDeliveryInput } from './dto/calculate-delivery.input.ts';

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

    const order = await this.orderService.create(createOrderInput);

    const { vendor } = order;
    const { vendorId } = vendor;

    pubSub.publish(`order-new-${vendorId}`, { newOrder: order });

    return order;
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

  @UseGuards(AccessTokenGuard)
  @Query(() => [Order])
  async findUserOrders(@Context('req') { user: huelager }: AccessTokenRequest) {
    const { entityId, entityType } = huelager;
    return await this.orderService.findUserOrders(entityType, entityId);
  }

  @Mutation(() => Number)
  async getDeliveryFee(calculateDeliveryInput: CalculateDeliveryInput) {
    return this.orderService.calculateDeliveryFee(calculateDeliveryInput);
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
  @Mutation(() => Order)
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

    const order = await this.orderService.updateOrderStatus(
      updateOrderStatusInput,
    );

    const { user } = order;
    const { userId } = user;

    pubSub.publish(`order-${userId}`, { orderStatusUpdated: order });

    return order;
  }

  @Subscription(() => Order)
  async orderStatusUpdated(
    @Context('req') { connectionParams }: { connectionParams: any },
  ) {
    const entityId = await this.orderService.verifySubscriber(connectionParams);

    return pubSub.asyncIterator(`order-${entityId}`);
  }

  @Subscription(() => Order)
  async newOrder(
    @Context('req') { connectionParams }: { connectionParams: any },
  ) {
    const entityId = await this.orderService.verifySubscriber(connectionParams);

    return pubSub.asyncIterator(`order-new-${entityId}`);
  }
}
