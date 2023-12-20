import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CanceledOrder } from './entities/canceled_order.entity';
import { OrderItem } from './entities/order_item.entity';
import { OrderRepository } from './order.repository';
import { ProductModule } from '../product/product.module';
import { HuelagersModule } from '../huelager/huelagers.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ProductModule,
    HuelagersModule,
    TypeOrmModule.forFeature([Order, OrderItem, CanceledOrder]),
    JwtModule.register({}),
  ],
  providers: [OrderResolver, OrderService, OrderRepository],
})
export class OrderModule {}
