import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from './entities/product.entity';
import { CreateFoodInput } from './dtos/create-food.input';
import { HuelagerType } from '../huelager/entities/huelager.entity';
import { UpdateFoodInput } from './dtos/update-food.input';

@Injectable()
export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async findOne(productId: string): Promise<Product> {
    const product = await this.repository.findProduct({ where: { productId } });

    if (!product)
      throw new NotFoundException(
        `Product with the id ${productId} does not exist `,
      );

    return product;
  }

  async findVendorProducts(vendorId: string): Promise<Product[]> {
    const products = await this.repository.findProducts({
      where: [{ vendor: { vendorId } }],
    });

    return products;
  }

  async addFood(createFoodInput: CreateFoodInput) {
    const {
      name,
      description,
      category,
      pricingMethod,
      price,
      sides,
      packageSizes,
      vendor,
      entityType,
      imgUrl,
      preparationTime,
    } = createFoodInput;

    if (entityType !== HuelagerType.VENDOR)
      throw new UnauthorizedException('Not a vendor');

    const food = this.repository.createFood({
      productInfo: { vendor, name, description, imgUrl },
      foodInfo: {
        category,
        pricingMethod,
        price,
        sides,
        packageSizes,
        preparationTime,
      },
    });

    return food;
  }

  async updateFood(updateFoodInput: UpdateFoodInput) {
    const {
      productId,
      name,
      description,
      category,
      pricingMethod,
      price,
      sides,
      packageSizes,
      preparationTime,
      availability,
      vendor,
      entityType,
      imgUrl,
    } = updateFoodInput;

    if (entityType !== HuelagerType.VENDOR)
      throw new UnauthorizedException('Not a vendor');

    const result = await this.repository.editProductInfo({
      where: { productId, vendor: { vendorId: vendor.vendorId } },
      update: {
        name,
        description,
        imgUrl,
      },
    });

    if (result.affected === 0)
      throw new NotFoundException(
        'No product with the given id was created by the vendor.',
      );

    await this.repository.editFoodInfo({
      where: { productId },
      update: {
        category,
        pricingMethod,
        price,
        preparationTime,
        availability,
        sides,
        packageSizes,
      },
    });

    return true;
  }
}
