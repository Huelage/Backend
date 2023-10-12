import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  async getProduct(@Args('productId', { type: () => Int }) productId: string) {
    return await this.productService.findOne(productId);
  }
}
