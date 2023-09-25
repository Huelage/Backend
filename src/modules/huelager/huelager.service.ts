import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { RefreshTokenDto } from './dtos/refresh-token.input';
import { compare, hash } from 'bcryptjs';
import { Huelager, HuelagerType } from './entities/huelager.entity';
import { HuelagerRepository } from './huelager.repository';
import { UpdatePhoneInput } from './dtos/update-phone.input';
import { genRandomOtp } from '../../common/helpers/helpers';
import { SmsService } from '../../providers/sms.service';
import { VerifyPhoneInput } from './dtos/verify-phone.input';
import { generateKeyPairSync } from 'crypto';
import { EmailService } from '../../providers/email.service';
import { VerifyEmailInput } from './dtos/verify-email.input';
import { ForgotPasswordInput } from './dtos/forgot-password.input';
import { UpdatePasswordInput } from './dtos/update-password.input';

@Injectable()
export class HuelagerService {
  private otpLifeSpan = 1800000; // 30 minutes

  constructor(
    private readonly repository: HuelagerRepository,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
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

    const huelager = await this.repository.findHuelager({
      where: { entityId },
    });
    if (!huelager) throw new UnauthorizedException();

    const matches = await compare(refreshToken, huelager.hashedRefreshToken);
    if (!matches) throw new UnauthorizedException();

    return this.jwtService.sign(
      { entityId },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '3d' },
    );
  }

  async updatePhone(updatePhoneInput: UpdatePhoneInput): Promise<Huelager> {
    const { entityId, phone } = updatePhoneInput;

    const possibleHuelagers = await this.repository.findHuelagers({
      where: [{ entityId }, { phone }],
    });
    const huelager = possibleHuelagers.find(
      (huelager) => huelager.entityId === entityId,
    );
    if (!huelager) throw new NotFoundException('No user with this id exists');

    /**
     * Make sure the chosen phone number does not already exist.
     * Even if it does, it should be this user that owns it.
     * i.e, they can 'change' their phone number to the same thing
     */
    if (possibleHuelagers.length > 1)
      throw new ConflictException(`Phone number already in use.`);

    const otp = genRandomOtp();
    huelager.phone = phone;
    huelager.otp = otp;
    huelager.isVerified = false;

    const name =
      huelager.entityType === HuelagerType.USER
        ? huelager.user.firstName
        : huelager.vendor.businessName;

    await this.repository.save(huelager);

    this.smsService.sendSms(
      huelager.phone,
      `Hi, ${name}Welcome to huelage  here is your OTP: ${otp} `,
    );
    return huelager;
  }

  async verifyPhone(verifyPhoneInput: VerifyPhoneInput): Promise<Huelager> {
    const { phone, otp } = verifyPhoneInput;

    const huelager = await this.repository.findHuelager({ where: { phone } });
    if (!huelager)
      throw new NotFoundException('No user with this phone number exists');

    const isExpired =
      Date.now() - huelager.updatedAt.getTime() > this.otpLifeSpan;
    const notMatch = huelager.otp !== otp;

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

  async requestEmailVerification(email: string): Promise<Huelager> {
    const huelager = await this.repository.findHuelager({ where: { email } });

    if (!huelager)
      throw new NotFoundException('No user with this email exists');

    const otp = genRandomOtp();

    huelager.otp = otp;
    await this.repository.save(huelager);
    const name =
      huelager.entityType === HuelagerType.USER
        ? huelager.user.firstName
        : huelager.vendor.businessName;
    this.emailService.sendOtpToEmail({ to: email, name, otp });

    return huelager;
  }

  async verifyEmail(verifyEmailInput: VerifyEmailInput): Promise<Huelager> {
    const { email, otp } = verifyEmailInput;

    const huelager = await this.repository.findHuelager({ where: { email } });
    if (!huelager)
      throw new NotFoundException('No user with this phone number exists');

    const isExpired =
      Date.now() - huelager.updatedAt.getTime() > this.otpLifeSpan;
    const notMatch = huelager.otp !== otp;

    if (isExpired || notMatch)
      throw new UnauthorizedException('The otp is invalid');

    huelager.emailIsVerified = true;
    await this.repository.save(huelager);

    return huelager;
  }

  async forgotPassword(
    forgotPasswordInput: ForgotPasswordInput,
  ): Promise<Huelager> {
    const { entityId, password } = forgotPasswordInput;

    const huelager = await this.repository.findHuelager({
      where: { entityId },
    });

    if (!huelager) throw new UnauthorizedException();

    const hashedPassword = await hash(password, 10);
    huelager.password = hashedPassword;

    this.repository.save(huelager);

    return huelager;
  }

  async updatePassword(
    updatePasswordInput: UpdatePasswordInput,
  ): Promise<Huelager> {
    const { entityId, oldPassword, password } = updatePasswordInput;

    const huelager = await this.repository.findHuelager({
      where: { entityId },
    });

    if (!huelager) throw new UnauthorizedException();

    const matches = await compare(oldPassword, huelager.password);

    if (!matches) throw new UnauthorizedException();

    huelager.password = await hash(password, 10);
    this.repository.save(huelager);

    return huelager;
  }

  async generateRSAKey(huelager: Huelager) {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 512,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    await this.repository.addBiometrics({
      huelager,
      key: privateKey,
    });

    return publicKey;
  }
}
