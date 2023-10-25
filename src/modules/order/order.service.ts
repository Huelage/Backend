import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateOrderInput } from './dto/create-order.input';
import { OrderRepository } from './order.repository';
import { FindOrderDto } from './dto/find-order.dto';
import { HuelagerType } from '../huelager/entities/huelager.entity';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async create(createOrderInput: CreateOrderInput) {
    const { entityType, vendorId, deliveryAddress, user, orderItems } =
      createOrderInput;

    if (entityType !== HuelagerType.VENDOR)
      throw new UnauthorizedException('Not a vendor.');

    const subtotal = orderItems.reduce((acc, item) => {
      acc += item.totalPrice;
      return acc;
    }, 0);

    const order = await this.orderRepository.createOrder({
      deliveryAddress,
      vendor: { vendorId },
      user,
      subtotal,
      orderItems,
      totalAmount: subtotal,
    });

    await this.orderRepository.saveOrderItem(order.orderItems);
    await this.orderRepository.saveOrder(order);

    return order;
  }

  async findOne(findOrder: FindOrderDto) {
    const { orderId, entityId } = findOrder;
    const order = await this.orderRepository.findOrder({ where: { orderId } });

    if (!order) throw new NotFoundException('Order not found.');

    if (entityId !== order.vendor.vendorId && entityId !== order.user.userId)
      throw new UnauthorizedException('Not authorized.');

    return order;
  }
}
