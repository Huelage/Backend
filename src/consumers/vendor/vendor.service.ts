import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { Vendor } from './vendor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsService } from '../../utils/sms.service';
import { compare, hash } from 'bcryptjs';
import { UpdatePhoneDto } from '../dtos/update-phone.dto';
import { CreateVendorDto } from '../dtos/create-account.dto';
import { UpdateVendorDto } from '../dtos/update-account.dto';
import { AuthenticateVendorDto } from '../dtos/authenticate-account.dto';
import { VerifyPhoneDto } from '../dtos/verify-phone.dto';
import { genRandomOtp } from '../../common/helpers/gen-otp.helper';
import { ConsumerRepository } from '../consumer.repository';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class VendorService {
  private otpLifeSpan = 1800000; // 30 minutes

  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly repository: ConsumerRepository,
    private readonly smsService: SmsService,
    private readonly authService: AuthService,
  ) {}

  async create(createVendorDto: CreateVendorDto) {
    const phoneOtp = genRandomOtp();
    // const

    const { firstName, lastName, phoneNumber, password, email, businessName } =
      createVendorDto;
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
    const vendor = this.vendorRepository.create({
      firstName,
      lastName,
      phoneNumber,
      businessName,
      email,
      phoneOtp,
      password: hashedPassword,
    });
    await this.vendorRepository.save(vendor);

    this.smsService.sendSms(
      vendor.phoneNumber,
      `Welcome to huelage ${vendor.firstName}, here is your OTP: ${phoneOtp} `,
    );
    return vendor;
  }

  async signIn(authenticateVendorDto: AuthenticateVendorDto) {
    const { email, password } = authenticateVendorDto;
    const vendor = await this.vendorRepository.findOne({
      where: { email },
    });

    if (!vendor)
      throw new UnauthorizedException('Invalid username or password.');
    const matches = await compare(password, vendor.password);
    if (!matches)
      throw new UnauthorizedException('Invalid username or password.');

    if (vendor.isVerified) {
      const { accessToken, refreshToken } = await this.authService.getTokens(
        vendor.id,
      );
      vendor.refreshToken = refreshToken;
      await this.vendorRepository.save(vendor);
      vendor.accessToken = accessToken;
    }

    return vendor;
  }

  async updatePhone(updatePhoneDto: UpdatePhoneDto): Promise<Vendor> {
    const { email, phoneNumber } = updatePhoneDto;

    const vendor = await this.vendorRepository.findOneBy({
      email: email,
    });

    if (!vendor)
      throw new NotFoundException('No vendor with this email exists');

    const exists = await this.repository.checkPhone({ where: { phoneNumber } });
    if (exists && vendor.phoneNumber !== phoneNumber)
      throw new ConflictException(`Phone number already in use.`);

    const phoneOtp = genRandomOtp();
    vendor.phoneNumber = phoneNumber;
    vendor.phoneOtp = phoneOtp;

    await this.vendorRepository.save(vendor);

    this.smsService.sendSms(
      vendor.phoneNumber,
      `Welcome to huelage ${vendor.firstName}, here is your OTP: ${phoneOtp} `,
    );
    return vendor;
  }

  async verifyPhone(verifyPhoneDto: VerifyPhoneDto): Promise<Vendor> {
    const { phoneNumber, phoneOtp } = verifyPhoneDto;

    const vendor = await this.vendorRepository.findOneBy({ phoneNumber });
    if (!vendor)
      throw new NotFoundException('No vendor with this phone number exists');

    const isExpired =
      Date.now() - vendor.updatedAt.getTime() > this.otpLifeSpan;
    const notMatch = vendor.phoneOtp !== phoneOtp;

    if (isExpired || notMatch)
      throw new UnauthorizedException('The otp is invalid');

    const { accessToken, refreshToken } = await this.authService.getTokens(
      vendor.id,
    );

    vendor.isVerified = true;
    vendor.refreshToken = refreshToken;
    await this.vendorRepository.save(vendor);

    return { ...vendor, accessToken };
  }

  findOne(id: number) {
    return `This action returns a #${id} vendor`;
  }

  update(id: number, _updateVendorDto: UpdateVendorDto) {
    return `This action updates a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
}
