import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Vendor } from './vendor/vendor.entity';
import { VendorService } from './vendor/vendor.service';
import { VendorResolver } from './vendor/vendor.resolver';
import { SmsService } from '../utils/sms.service';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';
import { UserResolver } from './user/user.resolver';
import { HuelagerRepository } from './huelager.repository';
import { AuthService } from './auth/auth.service';
import { RefreshTokenStrategy } from './auth/strategies/refresh-token.strategy';
import { AccessTokenStrategy } from './auth/strategies/acess-token.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, User]), JwtModule.register({})],
  providers: [
    VendorService,
    VendorResolver,
    SmsService,
    UserService,
    UserResolver,
    HuelagerRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthService,
  ],
})
export class HuelagersModule {}

// @Global()
// @Module({
//   imports: [JwtModule.register({}), TypeOrmModule.forFeature([Vendor, User])],
//   providers: [AccessTokenStrategy, RefreshTokenStrategy, AuthService],
//   exports: [AuthService],
// })
// export class AuthModule {}
