import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
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

@Injectable()
export class UserService {
  private otpLifeSpan = 1800000; // 30 minutes

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly repository: ConsumerRepository,
    private readonly smsService: SmsService,
    private readonly jwtService: JwtService,
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

    if (user.isVerified)
      user.accessToken = await this.jwtService.sign({ id: user.id });

    return user;
  }

  async updatePhone(updatePhoneDto: UpdatePhoneDto): Promise<User> {
    const { email, phoneNumber } = updatePhoneDto;

    const user = await this.userRepository.findOneBy({
      email: email,
    });
    if (!user) throw new NotFoundException('No user with this email exists');

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

    const payload = { id: user.id };
    const accessToken = await this.jwtService.sign(payload);

    user.isVerified = true;
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
