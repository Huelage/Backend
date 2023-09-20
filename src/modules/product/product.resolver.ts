import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateFoodInput } from './dto/create-food.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  addFood(@Args('input') createFoodInput: CreateFoodInput) {
    return this.productService.create(createFoodInput);
  }

  // @Mutation(() => Product)
  // updateProduct(
  //   @Args('updateProductInput') updateProductInput: UpdateProductInput,
  // ) {
  //   return this.productService.update(
  //     updateProductInput.id,
  //     updateProductInput,
  //   );
  // }

  // @Mutation(() => Product)
  // removeProduct(@Args('id', { type: () => Int }) id: number) {
  //   return this.productService.remove(id);
  // }
}
