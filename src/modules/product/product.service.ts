import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async findOne(productId: string): Promise<Product> {
    const product = await this.repository.findProduct({ where: { productId } });

    if (!product)
      throw new NotFoundException(
        `Product withthe id ${productId} does not exist `,
      );

    return product;
  }

  async findVendorProducts(vendorId: string): Promise<Product[]> {
    const products = await this.repository.findProducts({
      where: [{ vendor: { vendorId } }],
    });

    return products;
  }
}
