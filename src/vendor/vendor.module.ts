import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthResolver } from './auth/auth.resolver';
import { SmsService } from 'src/utils/sms.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config/jwt.config';
import { Vendor } from './vendor.entity';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([Vendor]),
  ],
  providers: [AuthService, AuthResolver, SmsService],
})
export class VendorModule {}
