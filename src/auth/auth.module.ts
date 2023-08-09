import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/acess-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from 'src/consumers/vendor/vendor.entity';
import { User } from 'src/consumers/user/user.entity';

@Global()
@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([Vendor, User])],
  providers: [AccessTokenStrategy, RefreshTokenStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
