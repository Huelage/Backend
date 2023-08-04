import { Module } from '@nestjs/common';
import { SmsService } from 'src/utils/sms.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config/jwt.config';
import { Vendor } from './vendor.entity';
import { VendorService } from './vendor.service';
import { VendorResolver } from './vendor.resolver';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([Vendor]),
  ],
  providers: [VendorService, VendorResolver, SmsService],
})
export class VendorModule {}
