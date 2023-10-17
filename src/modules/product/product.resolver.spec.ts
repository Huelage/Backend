import { Test, TestingModule } from '@nestjs/testing';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { DeepMocked } from '@golevelup/ts-jest';
import { Product } from './entities/product.entity';
import { Food } from './entities/food.entity';
import { CreateFoodInput } from './dtos/create-food.input';
import { HuelagerType } from '../huelager/entities/huelager.entity';
import { Vendor } from '../huelager/vendor/vendor.entity';
import { CustomRequest } from 'src/common/interfaces/request.interface';
import { UpdateFoodInput } from './dtos/update-food.input';

const mockProductService = () => ({
  findOne: jest.fn(),
  addFood: jest.fn(),
  updateFood: jest.fn(),
});

describe('ProductResolver', () => {
  let resolver: ProductResolver;
  let service: DeepMocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductResolver,
        { provide: ProductService, useFactory: mockProductService },
      ],
    }).compile();

    resolver = module.get<ProductResolver>(ProductResolver);
    service = module.get(ProductService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getProduct', () => {
    it('should return a product.', async () => {
      const product = new Product();
      service.findOne.mockResolvedValue(product);

      const result = await resolver.getProduct('someId');

      expect(result).toBe(product);
    });
  });

  describe('addFood', () => {
    it('adds a food and returns it.', async () => {
      const food = new Food();
      const createFoodInput = new CreateFoodInput();
      const req = {
        user: { entityType: HuelagerType.VENDOR, vendor: new Vendor() },
      } as CustomRequest;

      service.addFood.mockResolvedValue(food);

      const { entityType, vendor } = req.user;

      const result = await resolver.addFood(createFoodInput, req);

      expect(service.addFood).toHaveBeenCalledTimes(1);
      expect(service.addFood).toHaveBeenCalledWith({
        ...createFoodInput,
        entityType,
        vendor,
      });

      expect(result).toBe(food);
    });
  });

  describe('addFood', () => {
    it('updates a food and returns it.', async () => {
      const updateFoodInput = new UpdateFoodInput();
      const req = {
        user: { entityType: HuelagerType.VENDOR, vendor: new Vendor() },
      } as CustomRequest;

      service.updateFood.mockResolvedValue(true);

      const { entityType, vendor } = req.user;

      const result = await resolver.updateFood(updateFoodInput, req);

      expect(service.updateFood).toHaveBeenCalledTimes(1);
      expect(service.updateFood).toHaveBeenCalledWith({
        ...updateFoodInput,
        entityType,
        vendor,
      });

      expect(result).toStrictEqual(true);
    });
  });
});
