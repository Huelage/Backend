import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConsumerType } from 'src/common/enums/consumer-type.enum';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

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
