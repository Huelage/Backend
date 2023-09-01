import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from 'src/huelagers/vendor/vendor.entity';
import { Repository } from 'typeorm';
import { User } from 'src/huelagers/user/user.entity';
import { ConsumerType } from 'src/common/enums/consumer-type.enum';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }
  async validate(payload: JwtPayload) {
    const { id, type } = payload;
    if (!id || !type) throw new UnauthorizedException();
    const repository =
      type === ConsumerType.VENDOR ? 'vendorRepository' : 'userRepository';

    const consumer = await this[repository].findOneBy({ id });

    if (!consumer) {
      throw new UnauthorizedException();
    }

    return consumer;
  }
}
