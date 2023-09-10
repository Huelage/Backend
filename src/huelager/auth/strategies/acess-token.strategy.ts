import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { HuelagerType } from '../../../common/enums/huelager-type.enum';
import { HuelagerRepository } from 'src/huelager/huelager.repository';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly repository: HuelagerRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }
  async validate(payload: JwtPayload) {
    const { entityId } = payload;
    if (!entityId) throw new UnauthorizedException();

    const huelager = await this.repository.findHuelagerById(entityId);

    if (!huelager) {
      throw new UnauthorizedException();
    }

    return huelager;
  }
}
