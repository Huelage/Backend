import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async create(createOrderInput: CreateOrderInput) {
    const { vendorId, deliveryAddress, user, orderItems } = createOrderInput;
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
}
