import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { HuelagerRepository } from '../../../../modules/huelager/huelager.repository';
import { env } from '../../../../config/env.config';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly repository: HuelagerRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.jwt_access_secret,
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
