import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';

import { compare, hash } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserInput } from '../dtos/create-account.input';
import { AuthenticateUserInput } from '../dtos/authenticate-account.input';
import { UpdateUserDto } from '../dtos/update-account.input';
import { User } from './user.entity';
import { SmsService } from '../../../providers/sms.service';
import { genRandomOtp } from '../../../common/helpers/gen-otp.helper';
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

  async create(createUserDto: CreateUserInput) {
    const phoneOtp = genRandomOtp();

    const { firstName, lastName, phone, password, email } = createUserDto;
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
      phoneOtp,
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
      `Welcome to huelage ${user.firstName}, here is your OTP: ${phoneOtp} `,
    );

    return user;
  }

  async signIn(authenticateUserDto: AuthenticateUserInput): Promise<User> {
    const { email, password } = authenticateUserDto;
    const user = await this.userRepository.findOne({
      where: { entity: { email } },
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
