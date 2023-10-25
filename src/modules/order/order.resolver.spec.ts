import { Test, TestingModule } from '@nestjs/testing';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { DeepMocked } from '@golevelup/ts-jest';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { AccessTokenRequest } from 'src/common/interfaces/request.interface';
import { HuelagerType } from '../huelager/entities/huelager.entity';
import { User } from '../huelager/user/user.entity';

const mockOrderService = () => ({
  create: jest.fn(),
  findOne: jest.fn(),
});

describe('OrderResolver', () => {
  let resolver: OrderResolver;
  let service: DeepMocked<OrderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderResolver,
        { provide: OrderService, useFactory: mockOrderService },
      ],
    }).compile();

    resolver = module.get<OrderResolver>(OrderResolver);
    service = module.get(OrderService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createOrder', () => {
    const order = new Order(),
      createOrderInput = new CreateOrderInput(),
      req = {
        user: {
          entityType: HuelagerType.VENDOR,
          user: new User(),
        },
      } as AccessTokenRequest,
      { entityType, user } = req.user;

    it('creates an order and returns it', async () => {
      service.create.mockResolvedValue(order);

      const result = await resolver.createOrder(createOrderInput, req);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith({
        ...createOrderInput,
        entityType,
        user,
      });

      expect(result).toStrictEqual(order);
    });
  });

  describe('findOrder', () => {
    const order = new Order(),
      orderId = 'mockOrderId',
      req = {
        user: {
          entityId: 'mockEntityId',
        },
      } as AccessTokenRequest,
      { entityId } = req.user;

    it('finds the order by id and returns it', async () => {
      service.findOne.mockResolvedValue(order);

      const result = await resolver.findOrder(orderId, req);

      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith({ orderId, entityId });

      expect(result).toStrictEqual(order);
    });
  });
});
