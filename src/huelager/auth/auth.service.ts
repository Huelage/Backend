import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HuelagerType } from '../../common/enums/huelager-type.enum';
import { Vendor } from '../vendor/vendor.entity';
import { User } from '../user/user.entity';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getTokens(id: number, type: HuelagerType) {
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

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { id, type, refreshToken } = refreshTokenDto;

    const repository =
      type === HuelagerType.USER ? 'userRepository' : 'vendorRepository';
    const huelager = await this[repository].findOneBy({ id });
    if (!huelager) throw new UnauthorizedException();

    const matches = await compare(refreshToken, huelager.hashedRefreshToken);
    if (!matches) throw new UnauthorizedException();

    return this.jwtService.sign(
      { id, type },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '3d' },
    );
  }
}
