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

  async createFood(createFoodInfo: DeepPartial<Product>) {
    const food = new Food();
    await this.foodRepository.save(food);

    const product = await this.productRepository.create({
      ...createFoodInfo,
      food,
    });

    await this.productRepository.save(product);
    return product;
  }

  async findProductById(productId) {
    return this.productRepository.findOneBy({ productId });
  }

  async findProduct(params: { where: FindOptionsWhere<Product> }) {
    const { where } = params;
    return this.productRepository.findOneBy(where);
  }

  async findProducts(params: { where: FindOptionsWhere<Product>[] }) {
    const { where } = params;
    return this.productRepository.find({ where });
  }

  async editProductInfo(params: {
    where: FindOptionsWhere<Product>;
    update: QueryDeepPartialEntity<Product>;
  }) {
    const { where, update } = params;
    return await this.productRepository.update(where, update);
  }
}
