import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthResolver } from './auth/auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UtilsModule } from 'src/utils/utils.module';
import { SmsService } from 'src/utils/sms.service';
import { jwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([User]),
    UtilsModule,
  ],

  providers: [AuthService, AuthResolver, SmsService],
})
export class UserModule {}
