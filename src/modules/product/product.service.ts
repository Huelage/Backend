import { Injectable } from '@nestjs/common';
import { CreateFoodInput } from './dto/create-food.input';

@Injectable()
export class ProductService {
  createFood(createFoodInput: CreateFoodInput) {
    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
