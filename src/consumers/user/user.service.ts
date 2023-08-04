import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-account.dto';
import { VerifyPhoneDto } from '../dtos/verify-phone.dto';
import { UpdatePhoneDto } from '../dtos/update-phone.dto';
import { AuthenticateUserDto } from '../dtos/authenticate-account.dto';
import { UpdateUserDto } from '../dtos/update-account.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsService } from 'src/utils/sms.service';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
// import { AuthenticateUserDto } from './dto/authenticate-user.dto';

@Injectable()
export class UserService {
  private otpLifeSpan = 1800000; // 30 minutes

  private genRandomOtp = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly smsService: SmsService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const phoneOtp = this.genRandomOtp();

    const { firstName, lastName, phoneNumber, password, email } = createUserDto;
    const hashedPassword = await hash(password, 10);

    const userExists = await this.userRepository.findOne({
      where: [{ email: email }, { phoneNumber }],
    });

    if (userExists) {
      let inUse;
      const emailExists = email === userExists.email;
      const phoneExists = phoneNumber === userExists.phoneNumber;
      if (emailExists && phoneExists) {
        inUse = 'Email and Phone number';
      } else if (emailExists) {
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

    const phoneOtp = this.genRandomOtp();
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
