import { FindOptionsWhere } from 'typeorm';

import { User } from './user/user.entity';
import { Vendor } from './vendor/vendor.entity';

export type Consumer = User | Vendor;

export type ConsumerWhereOptions =
  | FindOptionsWhere<User>
  | FindOptionsWhere<Vendor>
  | FindOptionsWhere<User>[]
  | FindOptionsWhere<Vendor>[];

export type ConsumerRepositoryType = 'vendorRepository' | 'userRepository';
