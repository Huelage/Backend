import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  calculateDeliveryFee,
  calculateEstimatedDeliveryTime,
  numberToCurrency,
} from 'src/common/helpers/helpers';
import { HuelagerType } from '../huelager/entities/huelager.entity';
import { Wallet } from '../huelager/entities/huenit_wallet.entity';
import { HuelagerRepository } from '../huelager/huelager.repository';
import { pubSub } from '../huelager/huelager.resolver';
import { TransactionService } from '../transaction/transaction.service';
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
    private readonly transactionService: TransactionService,
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
      timestamp,
    } = createOrderInput;

    let huenitAmount = 0;
    let senderWallet: Wallet;

    if (paymentMethod !== PaymentMethod.CARD) {
      huenitAmount = paymentBreakdown.find(
        (payment) => payment.name.toLowerCase() === 'huenit',
      ).amount;

      senderWallet = await this.huelagerRepository.subtractFromBalance(
        user.userId,
        huenitAmount,
      );

      pubSub.publish(`wallet-${senderWallet.walletId}`, {
        walletBalanceUpdated: senderWallet.balance,
      });
    }

    const receiverWallet = await this.huelagerRepository.addToBalance(
      vendorId,
      totalAmount,
    );

    pubSub.publish(`wallet-${receiverWallet.walletId}`, {
      walletBalanceUpdated: receiverWallet.balance,
    });

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

    let items = '';
    orderItems.forEach((item, idx) => {
      items +=
        item.quantity +
        ' portion' +
        (item.quantity === 1 ? '' : 's') +
        ' of ' +
        item.productName +
        (idx === orderItems.length - 1 ? '' : ' + ');
    });
    const description =
      'Purchase from ' +
      vendor.businessName +
      ': ' +
      items +
      ' - NGN ' +
      numberToCurrency(totalAmount);

    order.transaction = await this.transactionService.orderTransaction({
      vendorId,
      userId: user.userId,
      huenitAmount,
      cardAmount: totalAmount - huenitAmount,
      totalAmount,
      paymentMethod,
      pgTransactionId,
      order,
      senderWallet,
      receiverWallet,
      description,
      timestamp: timestamp ? timestamp : new Date(),
    });

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
}
