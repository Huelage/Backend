import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthResolver } from './auth/auth.resolver';

@Module({
  providers: [AuthService, AuthResolver],
})
export class VendorModule {}
