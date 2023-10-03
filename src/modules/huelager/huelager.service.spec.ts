import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { HuelagerService } from './huelager.service';
import { HuelagerRepository } from './huelager.repository';
import { SmsService } from '../../providers/sms.service';
import { EmailService } from '../../providers/email.service';
import { otpIsExpired } from '../../common/helpers/helpers';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  generateKeyPairSync: () => ({
    publicKey: 'testPublicKey',
    privateKey: 'testPrivateKey',
  }),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: async () => 'testHash',
}));

jest.mock('../../common/helpers/helpers.ts', () => ({
  genRandomOtp: () => 1234,
  otpIsExpired: jest.fn(),
}));

const mockHuelagerRepository = () => ({
  findHuelager: jest.fn(),
  findHuelagers: jest.fn(),
  addBiometrics: jest.fn(),
  saveHuelager: jest.fn(),
});

const mockSmsService = () => ({
  sendSms: jest.fn(),
});

const mockEmailService = () => ({
  sendOtpToEmail: jest.fn(),
});

const mockJwtService = () => ({
  signAsync: jest.fn(),
});

describe('HuelagerService', () => {
  let service;
  let repository;
  let jwtService;
  let smsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HuelagerService,
        { provide: HuelagerRepository, useFactory: mockHuelagerRepository },
        { provide: SmsService, useFactory: mockSmsService },
        { provide: EmailService, useFactory: mockEmailService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = await module.get<HuelagerService>(HuelagerService);
    repository = await module.get<HuelagerRepository>(HuelagerRepository);
    jwtService = await module.get<JwtService>(JwtService);
    smsService = await module.get<SmsService>(SmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTokens', () => {
    const getTokens = async () => service.getTokens('testId');

    it('returns the access and refresh tokens got from the jwtService.signAsync() function called twice', async () => {
      jwtService.signAsync.mockResolvedValue('testToken');

      expect(jwtService.signAsync).not.toHaveBeenCalled();
      const result = await getTokens();
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);

      expect(result).toStrictEqual({
        accessToken: 'testToken',
        refreshToken: 'testToken',
      });
    });
  });

  describe('refreshToken', () => {
    const refreshToken = async () =>
      service.refreshToken({
        entityId: 'testId',
        refreshToken: 'testToken',
      });

    const mockFoundHuelager = {
      hashedRefreshToken: 'testHashedToken',
    };

    it('retrieves the huelager from the database with the findHuelager method', async () => {
      repository.findHuelager.mockResolvedValue(mockFoundHuelager);
      (compare as jest.MockedFunction<typeof compare>).mockImplementation(
        async () => true,
      );
      jwtService.signAsync.mockResolvedValue('testToken');

      const result = await refreshToken();

      expect(repository.findHuelager).toHaveBeenCalledTimes(1);
      expect(repository.findHuelager).toHaveBeenCalledWith({
        where: { entityId: 'testId' },
      });
      expect(result).toStrictEqual('testToken');
    });

    it('throws an unauthorized error if huelager is not found', () => {
      repository.findHuelager.mockResolvedValue(null);
      expect(refreshToken()).rejects.toThrow(UnauthorizedException);
    });

    it('throws an unauthorized error if the refresh token is incorrect', () => {
      repository.findHuelager.mockResolvedValue(mockFoundHuelager);
      (compare as jest.MockedFunction<typeof compare>).mockImplementation(
        async () => false,
      );
      expect(refreshToken()).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updatePhone', () => {
    const updatePhone = async () =>
      service.updatePhone({
        entityId: 'testId',
        phone: 'newPhone',
      });
    const mockFoundHuelager = {
      entityId: 'testId',
      entityType: 'user',
      user: { firstName: 'testName' },
    };
    const mockReturnHuelager = {
      ...mockFoundHuelager,
      phone: 'newPhone',
      otp: 1234,
      isVerified: false,
    };
    const mockRejectedHuelager = {
      ...mockFoundHuelager,
      entityId: 'testRejectedId',
    };

    it('updates the phone, sends SMS and returns the huelager', async () => {
      repository.findHuelagers.mockResolvedValue([mockFoundHuelager]);

      const result = await updatePhone();

      expect(repository.findHuelagers).toHaveBeenCalledTimes(1);
      expect(repository.findHuelagers).toHaveBeenCalledWith({
        where: [{ entityId: 'testId' }, { phone: 'newPhone' }],
      });
      expect(smsService.sendSms).toHaveBeenCalled();
      expect(result).toStrictEqual(mockReturnHuelager);
    });

    it('throws a not found error if the a huelager with that id is not found', async () => {
      repository.findHuelagers.mockResolvedValue([mockRejectedHuelager]);

      expect(updatePhone()).rejects.toThrow(NotFoundException);
    });

    it('throws an error if more than one huelager is returned from the .findHuelagers(): phone number in use', async () => {
      repository.findHuelagers.mockResolvedValue([
        mockRejectedHuelager,
        mockFoundHuelager,
      ]);

      expect(updatePhone()).rejects.toThrow(ConflictException);
    });
  });

  describe('verifyPhone', () => {
    const verifyPhone = async () =>
      service.verifyPhone({
        phone: 'testPhone',
        otp: 1234,
      });

    const mockFoundHuelager = {
      otp: 1234,
      entityId: 'testId',
    };

    const mockReturnedHuelager = {
      ...mockFoundHuelager,
      accessToken: 'testToken',
      refreshToken: 'testToken',
      hashedRefreshToken: 'testHash',
      isVerified: true,
    };

    const mockRejectedHuelager = {
      otp: 123,
      entityId: 'testId',
    };

    it('verifies the phone and returns the hulager', async () => {
      repository.findHuelager.mockResolvedValue(mockFoundHuelager);
      (
        otpIsExpired as jest.MockedFunction<typeof otpIsExpired>
      ).mockReturnValue(false);
      jwtService.signAsync.mockResolvedValue('testToken');

      const result = await verifyPhone();

      expect(repository.findHuelager).toHaveBeenCalledTimes(1);
      expect(repository.findHuelager).toHaveBeenCalledWith({
        where: { phone: 'testPhone' },
      });
      expect(result).toStrictEqual(mockReturnedHuelager);
    });

    it('throws a not found error if huelager is not found', async () => {
      repository.findHuelager.mockResolvedValue(null);
      expect(verifyPhone()).rejects.toThrow(NotFoundException);
    });

    it('throws an unauthorized error if the otp has expired', async () => {
      repository.findHuelager.mockResolvedValue(mockFoundHuelager);
      (
        otpIsExpired as jest.MockedFunction<typeof otpIsExpired>
      ).mockReturnValue(true);

      expect(verifyPhone()).rejects.toThrow(UnauthorizedException);
    });

    it('throws an unauthorized eerror if the otp is incorrect', async () => {
      repository.findHuelager.mockResolvedValue(mockRejectedHuelager);
      expect(verifyPhone()).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('requestEmailVerification', () => {
    const requestEmailVerification = async () =>
      service.requestEmailVerification('mockEmail');

    const mockFoundHuelager = {
      entityType: 'user',
      email: 'mockEmail',
      user: { firstName: 'testName' },
    };

    const mockReturnedHuelager = {
      ...mockFoundHuelager,
      otp: 1234,
    };

    it('updates the huelager otp and sends the otp to the email', async () => {
      repository.findHuelager.mockResolvedValue(mockFoundHuelager);

      const result = await requestEmailVerification();

      expect(repository.findHuelager).toHaveBeenCalledTimes(1);
      expect(repository.findHuelager).toHaveBeenCalledWith({
        where: { email: 'mockEmail' },
      });
      expect(result).toStrictEqual(mockReturnedHuelager);
    });

    it('throws a not found error if huelager is not found', async () => {
      repository.findHuelager.mockResolvedValue(null);
      expect(requestEmailVerification()).rejects.toThrow(NotFoundException);
    });
  });

  describe('verifyEmail', () => {
    const verifyEmail = async () =>
      service.verifyEmail({ email: 'mockEmail', otp: 1234 });

    const mockFoundHuelager = {
      otp: 1234,
    };

    const mockRejectedHuelager = {
      otp: 123,
    };

    const mockReturnedHuelager = {
      ...mockFoundHuelager,
      emailIsVerified: true,
    };

    it('updates the huelager otp and sends the otp to the email', async () => {
      repository.findHuelager.mockResolvedValue(mockFoundHuelager);
      (
        otpIsExpired as jest.MockedFunction<typeof otpIsExpired>
      ).mockReturnValue(false);

      const result = await verifyEmail();

      expect(repository.findHuelager).toHaveBeenCalledTimes(1);
      expect(repository.findHuelager).toHaveBeenCalledWith({
        where: { email: 'mockEmail' },
      });
      expect(result).toStrictEqual(mockReturnedHuelager);
    });

    it('throws a not found error if huelager is not found', async () => {
      repository.findHuelager.mockResolvedValue(null);
      expect(verifyEmail()).rejects.toThrow(NotFoundException);
    });

    it('throws an unauthorized error if the otp has expired', async () => {
      repository.findHuelager.mockResolvedValue(mockFoundHuelager);
      (
        otpIsExpired as jest.MockedFunction<typeof otpIsExpired>
      ).mockReturnValue(true);

      expect(verifyEmail()).rejects.toThrow(UnauthorizedException);
    });

    it('throws an unauthorized eerror if the otp is incorrect', async () => {
      repository.findHuelager.mockResolvedValue(mockRejectedHuelager);
      expect(verifyEmail()).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    const forgotPassword = async () =>
      service.forgotPassword({
        entityId: 'testId',
        password: 'testPassword',
      });

    const mockFoundHuelager = {};

    const mockReturnedHuelager = {
      password: 'testHash',
    };

    it('updates the password of the user and returns user', async () => {
      repository.findHuelager.mockResolvedValue(mockFoundHuelager);
      (compare as jest.MockedFunction<typeof compare>).mockImplementation(
        async () => true,
      );

      const result = await forgotPassword();

      expect(repository.findHuelager).toHaveBeenCalledTimes(1);
      expect(repository.findHuelager).toHaveBeenCalledWith({
        where: { entityId: 'testId' },
      });
      expect(result).toStrictEqual(mockReturnedHuelager);
    });

    it('throws a not found error if huelager is not found', async () => {
      repository.findHuelager.mockResolvedValue(null);
      expect(forgotPassword()).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePassword', () => {
    const updatePassword = async () =>
      service.updatePassword({
        entityId: 'testId',
        oldPassword: 'testOldPassword',
        password: 'testNewPassword',
      });

    const mockFoundHuelager = {
      password: 'oldTestHash',
    };

    const mockReturnedHuelager = {
      password: 'testHash',
    };

    it('updates the password of the user, after confirming the old password and returns the huelager', async () => {
      repository.findHuelager.mockResolvedValue(mockFoundHuelager);
      (compare as jest.MockedFunction<typeof compare>).mockImplementation(
        async () => true,
      );

      const result = await updatePassword();

      expect(repository.findHuelager).toHaveBeenCalledTimes(1);
      expect(repository.findHuelager).toHaveBeenCalledWith({
        where: { entityId: 'testId' },
      });
      expect(result).toStrictEqual(mockReturnedHuelager);
    });

    it('throws a not found error if huelager is not found', async () => {
      repository.findHuelager.mockResolvedValue(null);
      expect(updatePassword()).rejects.toThrow(NotFoundException);
    });

    it('throws an unauthorized error if the old password is incorrect', () => {
      repository.findHuelager.mockResolvedValue(mockFoundHuelager);
      (compare as jest.MockedFunction<typeof compare>).mockImplementation(
        async () => false,
      );
      expect(updatePassword).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('generateRSAKey', () => {
    const mockHuelager = {};
    const generateRSAKey = async () => service.generateRSAKey(mockHuelager);

    it('generates an RSA key pair and returns the public key', async () => {
      const result = await generateRSAKey();
      expect(result).toStrictEqual('testPublicKey');
    });
  });
});
