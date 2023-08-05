import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vendor } from './vendor/vendor.entity';
import { User } from './user/user.entity';
import {
  Consumer,
  ConsumerRepositoryType,
  ConsumerWhereOptions,
} from './consumer.repository.types';

@Injectable()
export class ConsumerRepository {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(params: {
    where: ConsumerWhereOptions;
    reposistory: ConsumerRepositoryType;
  }): Promise<Consumer> {
    const { where, reposistory } = params;
    return this[reposistory].findOneBy(where);
  }
}
