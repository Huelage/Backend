import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from './entities/product.entity';
import { CreateFoodInput } from './dtos/create-food.input';
import { HuelagerType } from '../huelager/entities/huelager.entity';

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
    } = createFoodInput;

    if (entityType !== HuelagerType.VENDOR)
      throw new UnauthorizedException('Not a vendor');

    const food = this.repository.createFood({
      productInfo: { vendor, name, description },
      foodInfo: { category, pricingMethod, price, sides, packageSizes },
    });

    return food;
  }
}
