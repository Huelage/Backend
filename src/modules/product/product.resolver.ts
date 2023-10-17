import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Food } from './entities/food.entity';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { CreateFoodInput } from './dtos/create-food.input';
import { UpdateFoodInput } from './dtos/update-food.input';
import { CustomRequest } from '../../common/interfaces/request.interface';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => Product)
  async getProduct(
    @Args('productId', { type: () => String }) productId: string,
  ) {
    return await this.productService.findOne(productId);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Food)
  async addFood(
    @Args('input') createFoodInput: CreateFoodInput,
    @Context('req') { user: huelager }: CustomRequest,
  ) {
    const { vendor, entityType } = huelager;
    createFoodInput = { ...createFoodInput, vendor, entityType };

    return await this.productService.addFood(createFoodInput);
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Boolean)
  async updateFood(
    @Args('input') updateFoodInput: UpdateFoodInput,
    @Context('req') { user: huelager }: CustomRequest,
  ): Promise<boolean> {
    const { vendor, entityType } = huelager;
    updateFoodInput = { ...updateFoodInput, vendor, entityType };

    return await this.productService.updateFood(updateFoodInput);
  }
}
