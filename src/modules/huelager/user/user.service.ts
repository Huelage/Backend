import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';

import { compare, hash } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserInput } from '../dtos/create-account.input';
import { AuthenticateUserInput } from '../dtos/authenticate-account.input';
import { User } from './user.entity';
import { SmsService } from '../../../providers/sms.service';
import { genRandomOtp } from '../../../common/helpers/helpers';
import { HuelagerRepository } from '../huelager.repository';
import { HuelagerService } from '../hulager.service';
import { HuelagerType } from '../entities/huelager.entity';

@Injectable()
export class UserService {
  private otpLifeSpan = 1800000; // 30 minutes

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly repository: HuelagerRepository,
    private readonly smsService: SmsService,
    private readonly huelagerService: HuelagerService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const otp = genRandomOtp();

    const { firstName, lastName, phone, password, email } = createUserInput;
    const hashedPassword = await hash(password, 10);

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

    const entity = await this.repository.createHuelager({
      phone,
      email,
      otp,
      password: hashedPassword,
      entityType: HuelagerType.USER,
    });

    const user = this.userRepository.create({
      firstName,
      lastName,
      entity,
      userId: entity.entityId,
    });

    try {
      await this.userRepository.save(user);
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

    const searchField = email ? { email } : { entityId };
    if (!searchField)
      throw new BadRequestException('Innput email or entityId field');

    const user = await this.userRepository.findOne({
      where: { entity: searchField },
      relations: { entity: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const matches = await compare(password, user.entity.password);
    if (!matches) throw new UnauthorizedException('Invalid credentials');

    if (user.entity.isVerified) {
      const { refreshToken, accessToken } =
        await this.huelagerService.getTokens(user.userId);

      user.entity.hashedRefreshToken = await hash(refreshToken, 10);
      await this.userRepository.save(user);

      user.entity.accessToken = accessToken;
      user.entity.refreshToken = refreshToken;
    }

    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
