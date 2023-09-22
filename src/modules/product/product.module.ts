import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Food } from './entities/food.entity';
import { ProductRepository } from './product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Food])],
  providers: [ProductResolver, ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
