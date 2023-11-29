import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateOrderInput } from './dto/create-order.input';
import { OrderRepository } from './order.repository';
import { FindOrderDto } from './dto/find-order.dto';
import { HuelagerType } from '../huelager/entities/huelager.entity';
import { Order } from './entities/order.entity';
import { UpdateOrderStatusInput } from './dto/update-status.input';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async create(createOrderInput: CreateOrderInput) {
    const {
      entityType,
      vendorId,
      deliveryAddress,
      user,
      orderItems,
      paymentMethod,
      subtotal,
    } = createOrderInput;

    if (entityType !== HuelagerType.USER)
      throw new UnauthorizedException('Not a user.');

    const order = await this.orderRepository.createOrder({
      deliveryAddress,
      vendor: { vendorId },
      user,
      subtotal,
      orderItems,
      paymentMethod,
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

  async findUserOrders(
    entityType: HuelagerType,
    userId: string,
  ): Promise<Order[]> {
    if (entityType !== HuelagerType.USER)
      throw new UnauthorizedException('Not a user.');

    const orders = await this.orderRepository.findOrders({
      where: [{ user: { userId } }],
    });

    return orders;
  }

  async findVendorOrders(
    entityType: HuelagerType,
    vendorId: string,
  ): Promise<Order[]> {
    if (entityType !== HuelagerType.VENDOR)
      throw new UnauthorizedException('Not a vendor.');

    const orders = await this.orderRepository.findOrders({
      where: [{ vendor: { vendorId } }],
    });

    return orders;
  }

  async updateOrderStatus(updateOrderStatusInput: UpdateOrderStatusInput) {
    const { orderId, status, entityType, entityId } = updateOrderStatusInput;

    if (entityType !== HuelagerType.VENDOR) {
      throw new UnauthorizedException('Not a vendor.');
    }

    const order = await this.orderRepository.findOrder({
      where: { orderId },
    });

    if (order.vendor.vendorId !== entityId) {
      throw new UnauthorizedException('Not authorized.');
    }

    if (!order) throw new NotFoundException('Order not found.');

    order.status = status;

    await this.orderRepository.saveOrder(order);

    return order;
  }
}
