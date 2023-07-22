import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsService } from 'src/utils/notification/sms.service';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly smsService: SmsService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const phoneOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const { firstName, lastName, phoneNumber, password, email } = createUserDto;
    const hashedPassword = await hash(password, 10);

    const user = await this.userRepository.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      phoneOtp,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        let inUse;
        const emailExists = error.message.includes(email);
        const phoneExists = error.message.includes(phoneNumber);

        if (emailExists) inUse = 'Email';
        if (phoneExists) inUse = 'Phone Number';

        throw new ConflictException(`${inUse} already in use`);
      } else {
        throw new InternalServerErrorException('An unexpected error occured');
      }
    }

    // this.smsService.sendSms(
    //   user.phoneNumber,
    //   `Welcome to huelage ${user.firstName}, here is your OTP: ${phoneOtp} `,
    // );
    return user;
  }

  // verifyPhone(otp) {}

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
