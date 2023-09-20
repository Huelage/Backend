import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CanceledOrder } from './entities/canceled_order.entity';
import { OrderItem } from './entities/order_item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, CanceledOrder])],
  providers: [OrderResolver, OrderService],
})
export class OrderModule {}
