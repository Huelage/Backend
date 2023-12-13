import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CanceledOrder } from './entities/canceled_order.entity';
import { OrderItem } from './entities/order_item.entity';
import { OrderRepository } from './order.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    ProductModule,
    TypeOrmModule.forFeature([Order, OrderItem, CanceledOrder]),
  ],
  providers: [OrderResolver, OrderService, OrderRepository],
})
export class OrderModule {}
