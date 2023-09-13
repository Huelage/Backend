import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { compare, hash } from 'bcryptjs';
import { Huelager } from './entities/huelager.entity';
import { HuelagerRepository } from './huelager.repository';
import { UpdatePhoneDto } from './dtos/update-phone.dto';
import { genRandomOtp } from '../common/helpers/gen-otp.helper';
import { SmsService } from 'src/utils/sms.service';
import { VerifyPhoneDto } from './dtos/verify-phone.dto';
import { generateKeyPairSync } from 'crypto';
import { User } from './user/user.entity';

@Injectable()
export class HuelagerService {
  private otpLifeSpan = 1800000; // 30 minutes

  constructor(
    private readonly jwtService: JwtService,
    private readonly repository: HuelagerRepository,
    private readonly smsService: SmsService,
  ) {}

  async getTokens(entityId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          entityId,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '3d',
        },
      ),
      this.jwtService.signAsync(
        {
          entityId,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '1y',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { entityId, refreshToken } = refreshTokenDto;

    const huelager = await this.repository.findHuelagerById(entityId);
    if (!huelager) throw new UnauthorizedException();

    const matches = await compare(refreshToken, huelager.hashedRefreshToken);
    if (!matches) throw new UnauthorizedException();

    return this.jwtService.sign(
      { entityId },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '3d' },
    );
  }

  async updatePhone(updatePhoneDto: UpdatePhoneDto): Promise<Huelager> {
    const { email, phone } = updatePhoneDto;

    const possibleHuelagers = await this.repository.findHuelagers({
      where: [{ email }, { phone }],
    });
    const huelager = possibleHuelagers.find(
      (huelager) => huelager.email === email,
    );
    if (!huelager)
      throw new NotFoundException('No user with this email exists');

    /**
     * Make sure the chosen phone number does not already exist.
     * Even if it does, it should be this user that owns it.
     * i.e, they can 'change' their phone number to the same thing
     */
    if (possibleHuelagers.length > 1)
      throw new ConflictException(`Phone number already in use.`);

    const phoneOtp = genRandomOtp();
    huelager.phone = phone;
    huelager.phoneOtp = phoneOtp;
    huelager.isVerified = false;

    await this.repository.save(huelager);

    this.smsService.sendSms(
      huelager.phone,
      `Welcome to huelage  here is your OTP: ${phoneOtp} `,
    );
    return huelager;
  }

  async verifyPhone(verifyPhoneDto: VerifyPhoneDto): Promise<Huelager> {
    const { phone, phoneOtp } = verifyPhoneDto;

    const huelager = await this.repository.findHuelager({ where: { phone } });
    if (!huelager)
      throw new NotFoundException('No user with this phone number exists');

    const isExpired =
      Date.now() - huelager.updatedAt.getTime() > this.otpLifeSpan;
    const notMatch = huelager.phoneOtp !== phoneOtp;

    if (isExpired || notMatch)
      throw new UnauthorizedException('The otp is invalid');

    const { accessToken, refreshToken } = await this.getTokens(
      huelager.entityId,
    );

    huelager.accessToken = accessToken;
    huelager.refreshToken = refreshToken;
    huelager.isVerified = true;
    huelager.hashedRefreshToken = await hash(refreshToken, 10);
    await this.repository.save(huelager);

    return huelager;
  }

  async generateRSAKey(user: User) {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 512,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'top secret',
      },
    });

    await this.repository.addBiometrics({
      entityId: user.entityId,
      key: privateKey,
    });

    return publicKey;
  }
}
