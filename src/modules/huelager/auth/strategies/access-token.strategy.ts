import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import * as config from 'config';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { HuelagerRepository } from '../../../../modules/huelager/huelager.repository';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly repository: HuelagerRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env.JWT_ACCESS_SECRET || config.get('jwt.accessSecret'),
    });
  }
  async validate(payload: JwtPayload) {
    const { entityId } = payload;

    if (!entityId) throw new UnauthorizedException();

    const huelager = await this.repository.findHuelager({
      where: { entityId },
    });

    if (!huelager) {
      throw new UnauthorizedException();
    }

    return huelager;
  }
}
