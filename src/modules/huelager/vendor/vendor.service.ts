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
import { CreateVendorInput } from '../dtos/create-account.input';
import { AuthenticateVendorInput } from '../dtos/authenticate-account.input';
import { genRandomOtp } from '../../../common/helpers/gen-otp.helper';
import { HuelagerRepository } from '../huelager.repository';
import { HuelagerService } from '../hulager.service';
import { HuelagerType } from '../entities/huelager.entity';

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

  async create(createVendorInput: CreateVendorInput) {
    const phoneOtp = genRandomOtp();

    const { businessAddress, phone, password, email, businessName, repName } =
      createVendorInput;
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

  async signIn(authenticateVendorInput: AuthenticateVendorInput) {
    const { email, password, vendorId } = authenticateVendorInput;
    const vendor = await this.vendorRepository.findOne({
      where: { entity: { email } },
      relations: { entity: true },
    });

    if (!vendor) throw new UnauthorizedException('Invalid credentials');

    if (vendor.vendorId !== vendorId)
      throw new UnauthorizedException('Invalid credentials');

    const matches = await compare(password, vendor.entity.password);
    if (!matches) throw new UnauthorizedException('Invalid credentials');

    if (vendor.entity.isVerified) {
      const { accessToken, refreshToken } =
        await this.huelagerService.getTokens(vendor.vendorId);

      vendor.entity.hashedRefreshToken = await hash(refreshToken, 10);
      await this.vendorRepository.save(vendor);

      vendor.entity.accessToken = accessToken;
      vendor.entity.refreshToken = refreshToken;
    }

    return vendor;
  }

  findOne(id: number) {
    return `This action returns a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
}
