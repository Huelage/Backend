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
import { ConsumerRepository } from '../consumer.repository';
import { AuthService } from 'src/consumers/auth/auth.service';
import { ConsumerType } from 'src/common/enums/consumer-type.enum';

@Injectable()
export class UserService {
  private otpLifeSpan = 1800000; // 30 minutes

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly repository: ConsumerRepository,
    private readonly smsService: SmsService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const phoneOtp = genRandomOtp();

    const { firstName, lastName, phoneNumber, password, email } = createUserDto;
    const hashedPassword = await hash(password, 10);

    const exists = await this.repository.checkEmailAndPhone({
      where: [{ email }, { phoneNumber }],
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
    const user = this.userRepository.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      phoneOtp,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    this.smsService.sendSms(
      user.phoneNumber,
      `Welcome to huelage ${user.firstName}, here is your OTP: ${phoneOtp} `,
    );
    return user;
  }

  async signIn(authenticateUserDto: AuthenticateUserDto) {
    const { email, password } = authenticateUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('Invalid username or password.');
    const matches = await compare(password, user.password);
    if (!matches)
      throw new UnauthorizedException('Invalid username or password.');

    if (user.isVerified) {
      const { refreshToken, accessToken } = await this.authService.getTokens(
        user.id,
        ConsumerType.USER,
      );
      user.refreshToken = refreshToken;
      await this.userRepository.save(user);
      user.accessToken = accessToken;
    }
    return user;
  }

  async updatePhone(updatePhoneDto: UpdatePhoneDto): Promise<User> {
    const { email, phoneNumber } = updatePhoneDto;

    const user = await this.userRepository.findOneBy({
      email: email,
    });
    if (!user) throw new NotFoundException('No user with this email exists');

    /**
     * Make sure the chosen phone number does not already exist.
     * Even if it does, it should be this user that owns it.
     * i.e, they can 'change' their phone number to the same thing
     */
    const exists = await this.repository.checkPhone({ where: { phoneNumber } });
    if (exists && user.phoneNumber !== phoneNumber)
      throw new ConflictException(`Phone number already in use.`);

    const phoneOtp = genRandomOtp();
    user.phoneNumber = phoneNumber;
    user.phoneOtp = phoneOtp;

    await this.userRepository.save(user);

    this.smsService.sendSms(
      user.phoneNumber,
      `Welcome to huelage ${user.firstName}, here is your OTP: ${phoneOtp} `,
    );
    return user;
  }

  async verifyPhone(verifyPhoneDto: VerifyPhoneDto): Promise<User> {
    const { phoneNumber, phoneOtp } = verifyPhoneDto;

    const user = await this.userRepository.findOneBy({ phoneNumber });
    if (!user)
      throw new NotFoundException('No user with this phone number exists');

    const isExpired = Date.now() - user.updatedAt.getTime() > this.otpLifeSpan;
    const notMatch = user.phoneOtp !== phoneOtp;

    if (isExpired || notMatch)
      throw new UnauthorizedException('The otp is invalid');

    const { accessToken, refreshToken } = await this.authService.getTokens(
      user.id,
      ConsumerType.USER,
    );

    user.isVerified = true;
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return { ...user, accessToken };
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
