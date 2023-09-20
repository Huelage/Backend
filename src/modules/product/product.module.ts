import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Food } from './entities/food.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Food])],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
