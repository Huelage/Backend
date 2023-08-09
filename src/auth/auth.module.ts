import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/acess-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [AccessTokenStrategy, RefreshTokenStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
