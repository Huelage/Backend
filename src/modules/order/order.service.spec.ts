import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { CreateOrderInput } from './dto/create-order.input';

import { User } from '../huelager/user/user.entity';
import { HuelagerType } from '../huelager/entities/huelager.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PaymentMethod } from './entities/order.entity';

const mockOrderRepository = () => ({
  createOrder: jest.fn(),
  findOrder: jest.fn(),
  saveOrderItem: jest.fn(),
  saveOrder: jest.fn(),
});

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: OrderRepository, useFactory: mockOrderRepository },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<OrderRepository>(OrderRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockInput = {
      vendorId: 'vendorId',
      orderItems: [
        {
          productId: 'productId',
          totalPrice: 100,
          quantity: 1,
          extras: {},
        },
      ],
      deliveryAddress: 'deliveryAddress',
      paymentMethod: PaymentMethod.CASH,
      subtotal: 100,
      user: new User(),
      entityType: HuelagerType.USER,
    } as CreateOrderInput;

    const create = (input) => service.create(input);

    it('creates an order', async () => {
      const {
        orderItems,
        vendorId,
        deliveryAddress,
        user,
        subtotal,
        paymentMethod,
      } = mockInput;
      const order = {
        orderItems,
      };

      orderRepository.createOrder.mockResolvedValue(order);

      const result = await create(mockInput);

      expect(orderRepository.createOrder).toHaveBeenCalledTimes(1);
      expect(orderRepository.createOrder).toHaveBeenCalledWith({
        vendor: { vendorId },
        deliveryAddress,
        user,
        orderItems,
        subtotal,
        paymentMethod,
        totalAmount: subtotal,
      });

      expect(orderRepository.saveOrderItem).toHaveBeenCalledTimes(1);
      expect(orderRepository.saveOrderItem).toHaveBeenCalledWith(
        order.orderItems,
      );

      expect(orderRepository.saveOrder).toHaveBeenCalledTimes(1);
      expect(orderRepository.saveOrder).toHaveBeenCalledWith(order);

      expect(result).toStrictEqual(order);
    });

    it('throws an unauthorized error', async () => {
      const mockUserInput = { ...mockInput, entityType: HuelagerType.VENDOR };

      expect(create(mockUserInput)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findOne', () => {
    const mockInput = { orderId: 'mockOrderId', entityId: 'mockEntityId' };
    const mockOrder = {
      vendor: { vendorId: 'mockEntityId' },
      user: { userId: 'mockEntityId' },
    };

    const findOne = (input) => service.findOne(input);

    it('finds the order object by id and returns it', async () => {
      orderRepository.findOrder.mockResolvedValue(mockOrder);

      const result = await findOne(mockInput);

      expect(orderRepository.findOrder).toHaveBeenCalledTimes(1);
      expect(orderRepository.findOrder).toHaveBeenCalledWith({
        where: { orderId: 'mockOrderId' },
      });

      expect(result).toStrictEqual(mockOrder);
    });

    it('throws a not found exception if order is not found', async () => {
      orderRepository.findOrder.mockResolvedValue(null);
      expect(findOne(mockInput)).rejects.toThrow(NotFoundException);
    });

    it('throws an unauthorized exception if entityId matches neither vendorId or userId in order', async () => {
      const mockUnauthorizedInput = {
        orderId: 'mockOrderId',
        entityId: 'mockUnauthorizedEntityId',
      };

      orderRepository.findOrder.mockResolvedValue(mockOrder);
      expect(findOne(mockUnauthorizedInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
