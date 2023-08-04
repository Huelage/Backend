import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { Vendor } from '../vendor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsService } from 'src/utils/sms.service';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { VerifyPhoneDto } from '../../user/auth/dto/verify-phone.dto';
import { UpdatePhoneDto } from '../../user/auth/dto/update-phone.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { AuthenticateVendorDto } from './dto/authenticate-vendor.dto';

@Injectable()
export class AuthService {
  private otpLifeSpan = 1800000; // 30 minutes

  private genRandomOtp = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly smsService: SmsService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createVendorDto: CreateVendorDto) {
    const phoneOtp = this.genRandomOtp();

    const { firstName, lastName, phoneNumber, password, email } =
      createVendorDto;
    const hashedPassword = await hash(password, 10);

    const vendorExists = await this.vendorRepository.findOne({
      where: [{ email: email }, { phoneNumber }],
    });

    if (vendorExists) {
      let inUse;
      const emailExists = email === vendorExists.email;
      const phoneExists = phoneNumber === vendorExists.phoneNumber;
      if (emailExists && phoneExists) {
        inUse = 'Email and Phone number';
      } else if (emailExists) {
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
      throw new UnauthorizedException('Invalid vendorname or password.');

    if (vendor.isVerified)
      vendor.accessToken = await this.jwtService.sign({ id: vendor.id });

    return vendor;
  }

  async updatePhone(updatePhoneDto: UpdatePhoneDto): Promise<Vendor> {
    const { email, phoneNumber } = updatePhoneDto;

    const vendor = await this.vendorRepository.findOneBy({
      email: email,
    });
    if (!vendor)
      throw new NotFoundException('No vendor with this email exists');

    const phoneOtp = this.genRandomOtp();
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

    const payload = { id: vendor.id };
    const accessToken = await this.jwtService.sign(payload);

    vendor.isVerified = true;
    await this.vendorRepository.save(vendor);

    return { ...vendor, accessToken };
  }

  findOne(id: number) {
    return `This action returns a #${id} vendor`;
  }

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return `This action updates a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
}
