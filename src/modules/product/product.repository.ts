import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Product } from './entities/product.entity';
import { Food } from './entities/food.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {}

  async createFood(params: {
    productInfo: DeepPartial<Product>;
    foodInfo: DeepPartial<Food>;
  }): Promise<Food> {
    const { productInfo, foodInfo } = params;

    const product = this.productRepository.create(productInfo);
    await this.productRepository.save(product);

    const food = await this.foodRepository.create({
      ...foodInfo,
      product: product,
    });

    await this.foodRepository.save(food);
    return food;
  }

  async findProduct(params: { where: FindOptionsWhere<Product> }) {
    const { where } = params;
    return this.productRepository.findOne({ where, relations: { food: true } });
  }

  async findProducts(params: { where: FindOptionsWhere<Product>[] }) {
    const { where } = params;
    return this.productRepository.find({ where, relations: { food: true } });
  }

  async editProductInfo(params: {
    where: FindOptionsWhere<Product>;
    update: QueryDeepPartialEntity<Product>;
  }) {
    const { where, update } = params;
    return await this.productRepository.update(where, update);
  }
}
