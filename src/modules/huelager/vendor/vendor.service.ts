import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';

import { Vendor } from './vendor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsService } from '../../../providers/sms.service';
import { compare, hash } from 'bcryptjs';
import { UpdatePhoneDto } from '../dtos/update-phone.dto';
import { CreateVendorDto } from '../dtos/create-account.dto';
import { UpdateVendorDto } from '../dtos/update-account.dto';
import { AuthenticateVendorDto } from '../dtos/authenticate-account.dto';
import { VerifyPhoneDto } from '../dtos/verify-phone.dto';
import { genRandomOtp } from '../../../common/helpers/gen-otp.helper';
import { HuelagerRepository } from '../huelager.repository';
import { HuelagerService } from '../hulager.service';
import { v4 } from 'uuid';
import { Huelager, HuelagerType } from '../entities/huelager.entity';

@Injectable()
export class VendorService {
  private otpLifeSpan = 1800000; // 30 minutes

  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly repository: HuelagerRepository,
    private readonly smsService: SmsService,
    private readonly huelagerService: HuelagerService,
  ) {}

  async create(createVendorDto: CreateVendorDto) {
    const phoneOtp = genRandomOtp();

    const { businessAddress, phone, password, email, businessName, repName } =
      createVendorDto;
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
      entityType: HuelagerType.VENDOR,
    });

    const vendor = this.vendorRepository.create({
      businessName,
      businessAddress,
      entity,
      repName,
    });

    try {
      await this.vendorRepository.save(vendor);
    } catch (error) {
      this.repository.removeHuelager(entity.entityId);
      throw new HttpException(error, 422);
    }

    this.smsService.sendSms(
      vendor.entity.phone,
      `Welcome to huelage ${vendor.businessName}, here is your OTP: ${phoneOtp} `,
    );

    return vendor;
  }

  async signIn(authenticateVendorDto: AuthenticateVendorDto) {
    const { email, password, vendorId } = authenticateVendorDto;
    const vendor = await this.vendorRepository.findOne({
      where: { entity: { email } },
      relations: { entity: true },
    });

    if (!vendor) throw new UnauthorizedException('Invalid credentials');

    if (vendor.entityId !== vendorId)
      throw new UnauthorizedException('Invalid credentials');

    const matches = await compare(password, vendor.entity.password);
    if (!matches) throw new UnauthorizedException('Invalid credentials');

    if (vendor.entity.isVerified) {
      const { accessToken, refreshToken } =
        await this.huelagerService.getTokens(vendor.entity.entityId);

      vendor.entity.hashedRefreshToken = await hash(refreshToken, 10);
      await this.vendorRepository.save(vendor);

      vendor.entity.accessToken = accessToken;
      vendor.entity.refreshToken = refreshToken;
    }

    return vendor;
  }

  async updatePhone(updatePhoneDto: UpdatePhoneDto): Promise<Huelager> {
    return this.huelagerService.updatePhone(updatePhoneDto);
  }

  async verifyPhone(verifyPhoneDto: VerifyPhoneDto): Promise<Huelager> {
    return this.huelagerService.verifyPhone(verifyPhoneDto);
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