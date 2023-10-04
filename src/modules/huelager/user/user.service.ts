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
import { UpdateUserInput } from '../dtos/update-account.input';
import { UpdateResult } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: HuelagerRepository,
    private readonly smsService: SmsService,
    private readonly huelagerService: HuelagerService,
  ) {}

  restructureHuelager(huelager: Huelager) {
    if (huelager.entityType !== HuelagerType.USER)
      throw new UnauthorizedException('Not a user');

    const { user, ...entity } = huelager;
    return { ...user, entity };
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

    if (user.entity.isVerified) {
      const { refreshToken, accessToken } =
        await this.huelagerService.getTokens(user.userId);

      user.entity.hashedRefreshToken = await hash(refreshToken, 10);
      await this.repository.saveUser(user);

      user.entity.accessToken = accessToken;
      user.entity.refreshToken = refreshToken;
    }

    return user;
  }

  async updateUserProfile(
    updateUserInput: UpdateUserInput,
    huelager: Huelager,
  ) {
    const { entityId: userId, entityType } = huelager;

    if (entityType !== HuelagerType.USER)
      throw new UnauthorizedException('Not a user.');

    const result: UpdateResult = await this.repository.editUserInfo({
      where: { userId },
      update: updateUserInput,
    });

    if (!result.affected)
      throw new UnauthorizedException('No change was made oh!');

    return 'succcess';
  }
}
