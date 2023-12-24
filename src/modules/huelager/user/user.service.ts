import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';

import { compare, hash } from 'bcryptjs';

import { CreateUserInput } from '../dtos/create-account.input';
import { AuthenticateUserInput } from '../dtos/authenticate-account.input';
import { User } from './user.entity';
import { SmsService } from '../../../providers/sms.service';
import { genRandomOtp } from '../../../common/helpers/helpers';
import { HuelagerRepository } from '../huelager.repository';
import { HuelagerService } from '../huelager.service';
import { Huelager, HuelagerType } from '../entities/huelager.entity';
import { EditUserLocationInput } from '../dtos/edit-locations.input';
import { EditUserProfileInput } from '../dtos/edit-profile.input';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: HuelagerRepository,
    private readonly smsService: SmsService,
    private readonly huelagerService: HuelagerService,
  ) {}

  async restructureHuelager(huelager: Huelager): Promise<User> {
    if (huelager.entityType !== HuelagerType.USER)
      throw new UnauthorizedException('Not a user');

    const { user, ...entity } = huelager;
    return { ...user, entity } as User;
  }

  async create(createUserInput: CreateUserInput) {
    const otp = genRandomOtp();

    const { firstName, lastName, phone, password, email } = createUserInput;

    const exists = await this.repository.checkEmailAndPhone({
      where: [{ email }, { phone }],
    });

    if (exists) {
      let inUse;
      if (exists.emailExists && exists.phoneExists) {
        inUse = 'Email and Phone number';
      } else if (exists.emailExists) {
        inUse = 'Email';
      } else {
        inUse = 'Phone number';
      }
      throw new ConflictException(`${inUse} already in use.`);
    }

    const hashedPassword = await hash(password, 10);
    const entity = await this.repository.createHuelager({
      phone,
      email,
      otp,
      password: hashedPassword,
      entityType: HuelagerType.USER,
    });

    const user = await this.repository.createUser({
      firstName,
      lastName,
      entity,
      userId: entity.entityId,
      knownLocation: { locations: [] },
    });

    try {
      await this.repository.saveUser(user);
    } catch (error) {
      this.repository.removeHuelager(entity.entityId);
      throw new HttpException(error, 422);
    }

    this.smsService.sendSms(
      entity.phone,
      `Welcome to huelage ${user.firstName}, here is your OTP: ${otp} `,
    );

    return user;
  }

  async signIn(authenticateUserInput: AuthenticateUserInput): Promise<User> {
    const { email, password, entityId } = authenticateUserInput;

    if (!entityId && !email)
      throw new BadRequestException('Input email or entityId field');

    const searchField = email ? { email } : { entityId };

    const user = await this.repository.findUser({
      where: { entity: searchField },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const matches = await compare(password, user.entity.password);
    if (!matches) throw new UnauthorizedException('Invalid credentials');

    if (user.entity.isPhoneVerified) {
      const { refreshToken, accessToken } =
        await this.huelagerService.getTokens(user.userId);

      user.entity.hashedRefreshToken = await hash(refreshToken, 10);

      this.repository.saveHuelager(user.entity);

      user.entity.accessToken = accessToken;
      user.entity.refreshToken = refreshToken;
    }

    return user;
  }

  async editLocation(editUserLocationInput: EditUserLocationInput) {
    const { locationId, name, userId, entityType } = editUserLocationInput;

    if (entityType !== HuelagerType.USER)
      throw new UnauthorizedException('Not a user');

    const user = await this.repository.findUser({ where: { userId } });

    if (!name) {
      user.knownLocation.locations = user.knownLocation.locations.filter(
        (location) => location.locationId !== locationId,
      );
    } else {
      user.knownLocation.locations.push({ locationId, name });
    }

    await this.repository.saveUser(user);

    return user;
  }

  async editProfile(editUserProfileInput: EditUserProfileInput) {
    const { imgUrl, user } = editUserProfileInput;

    user.entity.imgUrl = imgUrl;

    await this.repository.saveHuelager(user.entity);
    return user;
  }
}
