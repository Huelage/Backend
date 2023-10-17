import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { Product } from './entities/product.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Food } from './entities/food.entity';

import { HuelagerType } from '../huelager/entities/huelager.entity';

const mockProductRepository = () => ({
  findProduct: jest.fn(),
  findProducts: jest.fn(),
  createFood: jest.fn(),
  editProductInfo: jest.fn(),
  editFoodInfo: jest.fn(),
});

describe('ProductService', () => {
  let service;
  let productRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useFactory: mockProductRepository },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    const productId = 'testProductId';
    const findOne = () => service.findOne(productId);
    const product = new Product();

    it('finds and returns a product.', async () => {
      productRepository.findProduct.mockResolvedValue(product);

      const result = await findOne();

      expect(productRepository.findProduct).toHaveBeenCalledTimes(1);
      expect(productRepository.findProduct).toHaveBeenCalledWith({
        where: { productId },
      });
      expect(result).toStrictEqual(product);
    });

    it('throws a not found exception if the product does not exist.', async () => {
      productRepository.findProduct.mockResolvedValue(null);

      expect(findOne()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    const vendorId = 'testVendorId';

    const findVendorProducts = () => service.findVendorProducts(vendorId);
    const product = new Product();

    it('finds products belonging to a vendor and returns', async () => {
      productRepository.findProducts.mockResolvedValue([product]);

      const result = await findVendorProducts();

      expect(productRepository.findProducts).toHaveBeenCalledTimes(1);
      expect(productRepository.findProducts).toHaveBeenCalledWith({
        where: [{ vendor: { vendorId } }],
      });
      expect(result).toStrictEqual([product]);
    });
  });

  describe('CREATE AND UPDATE FOOD', () => {
    const createFoodInput = {
        name: '',
        description: '',
        category: '',
        pricingMethod: '',
        price: '',
        sides: '',
        packageSizes: '',
        vendor: { vendorId: '' },
        entityType: HuelagerType.VENDOR,
      },
      {
        name,
        description,
        category,
        pricingMethod,
        price,
        sides,
        packageSizes,
        vendor,
      } = createFoodInput;

    describe('addFood', () => {
      const addFood = (input) => service.addFood(input);
      const food = new Food();

      it('verifies that a vendor made the request and adds the food.', async () => {
        productRepository.createFood.mockResolvedValue(food);

        const result = await addFood(createFoodInput);

        expect(productRepository.createFood).toHaveBeenCalledTimes(1);
        expect(productRepository.createFood).toHaveBeenCalledWith({
          productInfo: { vendor, name, description },
          foodInfo: { category, pricingMethod, price, sides, packageSizes },
        });

        expect(result).toStrictEqual(food);
      });

      it('throws an unauthorized exception if a user makes the request.', async () => {
        const createFoodUserInput = {
          ...createFoodInput,
          entityType: HuelagerType.USER,
        };

        expect(addFood(createFoodUserInput)).rejects.toThrow(
          UnauthorizedException,
        );
      });
    });

    describe('updateFood', () => {
      const updateFoodInput = {
          ...createFoodInput,
          productId: 'testProductId',
        },
        {
          name,
          description,
          category,
          pricingMethod,
          price,
          sides,
          packageSizes,
          vendor,
          productId,
        } = updateFoodInput;
      const updateFood = (input) => service.updateFood(input);

      it('verifies that a vendor made the request and updates the food info.', async () => {
        productRepository.editProductInfo.mockResolvedValue({ affected: 1 });

        const result = await updateFood(updateFoodInput);

        expect(productRepository.editProductInfo).toHaveBeenCalledTimes(1);
        expect(productRepository.editProductInfo).toHaveBeenCalledWith({
          where: { productId, vendor: { vendorId: vendor.vendorId } },
          update: {
            name,
            description,
          },
        });

        expect(productRepository.editFoodInfo).toHaveBeenCalledTimes(1);
        expect(productRepository.editFoodInfo).toHaveBeenCalledWith({
          where: { productId },
          update: { category, pricingMethod, price, sides, packageSizes },
        });

        expect(result).toStrictEqual(true);
      });

      it('throws an unauthorized exception if a user makes the request.', async () => {
        const updateFoodUserInput = {
          ...updateFoodInput,
          entityType: HuelagerType.USER,
        };

        expect(updateFood(updateFoodUserInput)).rejects.toThrow(
          UnauthorizedException,
        );
      });

      it('throws a not found exception no product is edited.', async () => {
        productRepository.editProductInfo.mockResolvedValue({ affected: 0 });

        const updateFoodNotFoundInput = {
          ...updateFoodInput,
        };

        expect(updateFood(updateFoodNotFoundInput)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
