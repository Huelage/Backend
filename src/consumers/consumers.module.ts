import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { jwtConfig } from '../config/jwt.config';
import { Vendor } from './vendor/vendor.entity';
import { VendorService } from './vendor/vendor.service';
import { VendorResolver } from './vendor/vendor.resolver';
import { SmsService } from '../utils/sms.service';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';
import { UserResolver } from './user/user.resolver';
import { ConsumerRepository } from './consumer.repository';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([Vendor, User]),
  ],
  providers: [
    VendorService,
    VendorResolver,
    SmsService,
    UserService,
    UserResolver,
    ConsumerRepository,
  ],
})
export class ConsumersModule {}
