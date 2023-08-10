import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConsumerType } from '../../common/enums/consumer-type.enum';
import { Vendor } from '../vendor/vendor.entity';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getTokens(id: number, type: ConsumerType) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          type,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '3d',
        },
      ),
      this.jwtService.signAsync(
        {
          id,
          type,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '1y',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    console.log(refreshToken);
    return refreshToken;
  }
}
