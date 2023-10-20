import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';

@Injectable()
export class OrderService {
  create(createOrderInput: CreateOrderInput) {
    return 'This action adds a new order';
  }
}
