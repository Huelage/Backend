import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './vendor/vendor.entity';
import { Repository } from 'typeorm';
import { User } from './user/user.entity';

@Injectable()
export class ConsumerRepository {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
}
