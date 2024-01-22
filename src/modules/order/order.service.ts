import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  calculateDeliveryFee,
  calculateEstimatedDeliveryTime,
} from 'src/common/helpers/helpers';
import { HuelagerType } from '../huelager/entities/huelager.entity';
import { HuelagerRepository } from '../huelager/huelager.repository';
import { CalculateDeliveryInput } from './dto/calculate-delivery.input.ts';
import { CreateOrderInput } from './dto/create-order.input';
import { FindOrderDto } from './dto/find-order.dto';
import { UpdateOrderStatusInput } from './dto/update-status.input';
import { Order, OrderStatus, PaymentMethod } from './entities/order.entity';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly huelagerRepository: HuelagerRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(createOrderInput: CreateOrderInput) {
    const {
      vendorId,
      orderItems,
      deliveryAddress,
      deliveryFee,
      totalAmount,
      pgTransactionId,
      discount,
      subtotal,
      paymentMethod,
      paymentBreakdown,
      entityType,
      user,
    } = createOrderInput;

    if (paymentMethod !== PaymentMethod.CARD) {
      const huenitPrice = totalAmount;

      huenitPrice; // to remove the error;
      pgTransactionId; // to remove the error;
    }

    if (entityType !== HuelagerType.USER)
      throw new UnauthorizedException('Not a user.');

    const estimatedDeliveryTime = calculateEstimatedDeliveryTime();

    const vendor = await this.huelagerRepository.findVendor({
      where: { vendorId },
    });

    const order = await this.orderRepository.createOrder({
      vendor,
      user,
      subtotal,
      orderItems: orderItems.map((orderItem) => {
        const { productId, productName, ...theRest } = orderItem;
        return {
          ...theRest,
          product: { productId, name: productName },
        };
      }),
      totalAmount,
      estimatedDeliveryTime,
      deliveryFee,
      deliveryAddress,
      discount,
      paymentBreakdown,
      paymentMethod,
      status: OrderStatus.PENDING,
    });

    await this.orderRepository.saveOrderItem(order.orderItems);
    await this.orderRepository.saveOrder(order);

    return order;
  }

  async calculateDeliveryFee(calculateDeliveryInput: CalculateDeliveryInput) {
    calculateDeliveryInput.deliveryAddress.locationId;
    const deliveryFee = calculateDeliveryFee();

    return deliveryFee;
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

    if (!order) throw new NotFoundException('Order not found.');

    if (order.vendor.vendorId !== entityId) {
      throw new UnauthorizedException('Not authorized.');
    }

    order.status = status;

    await this.orderRepository.saveOrder(order);

    return order;
  }

  async verifySubscriber(connectionParams: any) {
    const authorization = connectionParams.Authorization;

    if (!authorization) throw new Error('Not authorized.');

    const token = authorization.replace('Bearer ', '');

    if (!token) throw new Error('Not authorized.');

    const { entityId } = (await this.jwtService.decode(token)) as {
      entityId: string;
    };

    const huelager = await this.huelagerRepository.findHuelager({
      where: { entityId },
    });

    if (!huelager) {
      throw new UnauthorizedException();
    }

    return entityId;
  }
}
