import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Vendor } from './vendor/vendor.entity';
import { User } from './user/user.entity';
import { ConsumerWhereOptions } from './consumer.repository.types';

@Injectable()
export class ConsumerRepository {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findEmailOrPhone(params: { where: ConsumerWhereOptions }) {
    const { where } = params;
    const [{ email }, { phoneNumber }] = where;
    const existingVendor = await this.vendorRepository.findOneBy(where);
    const existingUser = await this.userRepository.findOneBy(where);

    if (existingVendor) {
      return {
        emailExists: existingVendor.email === email ? true : false,
        phoneExists: existingVendor.phoneNumber === phoneNumber ? true : false,
      };
    } else if (existingUser) {
      return {
        emailExists: existingUser.email === email ? true : false,
        phoneExists: existingUser.phoneNumber === phoneNumber ? true : false,
      };
    }
    return null;
  }
}
