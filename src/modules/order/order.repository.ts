import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Order } from './entities/order.entity';
import { CanceledOrder } from './entities/canceled_order.entity';
import { OrderItem } from './entities/order_item.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(CanceledOrder)
    private readonly cancelOrderRepository: Repository<CanceledOrder>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(createOrderInfo: DeepPartial<Order>) {
    const order = await this.orderRepository.create({
      ...createOrderInfo,
    });

    return order;
  }

  async findOrder(params: { where: FindOptionsWhere<Order> }) {
    const { where } = params;
    return this.orderRepository.findOne({
      where,
      relations: { vendor: true, user: true, orderItems: true },
    });
  }

  async findOrders(params: { where: FindOptionsWhere<Order>[] }) {
    const { where } = params;
    return this.orderRepository.find({ where });
  }

  async editOrderInfo(params: {
    where: FindOptionsWhere<Order>;
    update: QueryDeepPartialEntity<Order>;
  }) {
    const { where, update } = params;
    return await this.orderRepository.update(where, update);
  }

  async cancelOrder(cancelOrderInfo: DeepPartial<CanceledOrder>) {
    const canceledOrder = await this.cancelOrderRepository.create({
      ...cancelOrderInfo,
    });

    await this.cancelOrderRepository.save(canceledOrder);
  }

  async createOrderItem(orderItemInfo: DeepPartial<OrderItem>) {
    const orderItem = await this.orderItemRepository.create({
      ...orderItemInfo,
    });

    await this.orderItemRepository.save(orderItem);
  }

  async saveOrder(order: Order) {
    await this.orderRepository.save(order);
  }

  async saveOrderItem(orderItems: OrderItem[]) {
    await this.orderItemRepository.save(orderItems);
  }
}
