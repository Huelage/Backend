import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Vendor } from './vendor/vendor.entity';
import { VendorService } from './vendor/vendor.service';
import { VendorResolver } from './vendor/vendor.resolver';
import { SmsService } from '../../providers/sms.service';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';
import { UserResolver } from './user/user.resolver';
import { HuelagerRepository } from './huelager.repository';
import { HuelagerService } from './hulager.service';
import { RefreshTokenStrategy } from './auth/strategies/refresh-token.strategy';
import { AccessTokenStrategy } from './auth/strategies/access-token.strategy';
import { JwtModule } from '@nestjs/jwt';
import { Huelager } from './entities/huelager.entity';
import { Wallet } from './entities/huenit_wallet.entity';
import { Biometric } from './entities/biometric.entity';
import { Review } from './entities/review.entity';

import { HuelagerResolver } from './huelager.resolver';
import { ProvidersModule } from 'src/providers/providers.module';

@Module({
  imports: [
    ProvidersModule,
    TypeOrmModule.forFeature([
      Vendor,
      User,
      Huelager,
      Wallet,
      Biometric,
      Review,
    ]),
    JwtModule.register({}),
  ],
  providers: [
    VendorService,
    VendorResolver,
    UserService,
    UserResolver,
    HuelagerRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    HuelagerService,
    HuelagerResolver,
  ],
  exports: [HuelagerRepository],
})
export class HuelagersModule {}

// @Global()
// @Module({
//   imports: [JwtModule.register({}), TypeOrmModule.forFeature([Vendor, User])],
//   providers: [AccessTokenStrategy, RefreshTokenStrategy, HuelagerService],
//   exports: [HuelagerService],
// })
// export class AuthModule {}
