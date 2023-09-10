import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { compare, hash } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../dtos/create-account.dto';
import { VerifyPhoneDto } from '../dtos/verify-phone.dto';
import { UpdatePhoneDto } from '../dtos/update-phone.dto';
import { AuthenticateUserDto } from '../dtos/authenticate-account.dto';
import { UpdateUserDto } from '../dtos/update-account.dto';
import { User } from './user.entity';
import { SmsService } from '../../utils/sms.service';
import { genRandomOtp } from '../../common/helpers/gen-otp.helper';
import { HuelagerRepository } from '../huelager.repository';
import { AuthService } from '../../huelager/auth/auth.service';
import { Huelager, HuelagerType } from '../entities/huelager.entity';

@Injectable()
export class UserService {
  private otpLifeSpan = 1800000; // 30 minutes

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly repository: HuelagerRepository,
    private readonly smsService: SmsService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
      entityId: entity.entityId,
    });
    await this.userRepository.save(user);

    this.smsService.sendSms(
      entity.phone,
      `Welcome to huelage ${user.firstName}, here is your OTP: ${phoneOtp} `,
    );
    return user;
  }

  async signIn(authenticateUserDto: AuthenticateUserDto) {
    const { email, password } = authenticateUserDto;
    const user = await this.repository.findHuelager({
      where: { email, entityType: HuelagerType.USER },
    });

    if (!user) throw new UnauthorizedException('Invalid username or password.');
    const matches = await compare(password, user.password);
    if (!matches)
      throw new UnauthorizedException('Invalid username or password.');

    if (user.isVerified) {
      const { refreshToken, accessToken } = await this.authService.getTokens(
        user.entityId,
        HuelagerType.USER,
      );
      user.hashedRefreshToken = await hash(refreshToken, 10);
      await this.repository.save(user);

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
    }
    return user;
  }

  async updatePhone(updatePhoneDto: UpdatePhoneDto): Promise<Huelager> {
    return this.authService.updatePhone(updatePhoneDto);
  }

  async verifyPhone(verifyPhoneDto: VerifyPhoneDto): Promise<Huelager> {
    return this.authService.verifyPhone(verifyPhoneDto);
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
