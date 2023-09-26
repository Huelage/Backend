import { Test } from '@nestjs/testing';
import { HuelagerService } from './huelager.service';
import { HuelagerRepository } from './huelager.repository';
import { SmsService } from '../../providers/sms.service';
import { EmailService } from '../../providers/email.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('../../common/helpers/helpers.ts', () => ({
  genRandomOtp: () => 1234,
}));

const mockHuelagerRepository = () => ({
  findHuelager: jest.fn(),
  findHuelagers: jest.fn(),
  save: jest.fn(),
});

const mockSmsService = () => ({
  sendSms: jest.fn(),
});

const mockEmailService = () => ({});

const mockJwtService = () => ({
  signAsync: jest.fn(),
});

describe('HuelagerService', () => {
  let huelagerService;
  let huelagerRepository;
  let jwtService;
  let smsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HuelagerService,
        { provide: HuelagerRepository, useFactory: mockHuelagerRepository },
        { provide: SmsService, useFactory: mockSmsService },
        { provide: EmailService, useFactory: mockEmailService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    huelagerService = await module.get<HuelagerService>(HuelagerService);
    huelagerRepository = await module.get<HuelagerRepository>(
      HuelagerRepository,
    );
    jwtService = await module.get<JwtService>(JwtService);
    smsService = await module.get<SmsService>(SmsService);
  });

  it('should be defined', () => {
    expect(huelagerService).toBeDefined();
  });

  describe('getTokens', () => {
    const getTokens = async () => huelagerService.getTokens('testId');

    it('returns the access and refresh tokens got from the jwtService.signAsync() function called twice', async () => {
      jwtService.signAsync.mockResolvedValue('testHash');

      expect(jwtService.signAsync).not.toHaveBeenCalled();
      const result = await getTokens();
      expect(jwtService.signAsync).toHaveBeenCalled();

      expect(result).toEqual({
        accessToken: 'testHash',
        refreshToken: 'testHash',
      });
    });
  });

  describe('refreshToken', () => {
    const refreshToken = async () =>
      huelagerService.refreshToken({
        entityId: 'testId',
        refreshToken: 'testToken',
      });

    const mockHuelager = {
      hashedRefreshToken: 'testHashedToken',
    };

    it('retrieves the huelager from the database with the findHuelager method', async () => {
      huelagerRepository.findHuelager.mockResolvedValue(mockHuelager);
      (compare as jest.MockedFunction<typeof compare>).mockImplementation(
        async () => true,
      );
      jwtService.signAsync.mockResolvedValue('testHash');

      const result = await refreshToken();

      expect(result).toEqual('testHash');
      expect(huelagerRepository.findHuelager).toHaveBeenCalledWith({
        where: { entityId: 'testId' },
      });
    });

    it('throws an error if huelager is not found', () => {
      huelagerRepository.findHuelager.mockResolvedValue(null);
      expect(refreshToken()).rejects.toThrow(UnauthorizedException);
    });

    it('throws an error if the refresh token does not match the hashed one', () => {
      huelagerRepository.findHuelager.mockResolvedValue(mockHuelager);
      (compare as jest.MockedFunction<typeof compare>).mockImplementation(
        async () => false,
      );
      expect(
        huelagerService.refreshToken({
          entityId: 'testId',
          refreshToken: 'testToken',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updatePhone', () => {
    const updatePhone = async () =>
      huelagerService.updatePhone({
        entityId: 'testId',
        phone: 'newPhone',
      });
    const mockFoundHuelager = {
      entityType: 'user',
      user: { firstName: 'testName' },
      entityId: 'testId',
      phone: 'previousPhone',
      otp: 123,
      isVerified: true,
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

    it('successfully updates the phone, sends SMS and returns the huelager', async () => {
      huelagerRepository.findHuelagers.mockResolvedValue([mockFoundHuelager]);

      const result = await updatePhone();
      expect(smsService.sendSms).toHaveBeenCalled();
      expect(result).toEqual(mockReturnHuelager);
    });

    it('throws an error if the a huelager with that id is not found', async () => {
      huelagerRepository.findHuelagers.mockResolvedValue([
        mockRejectedHuelager,
      ]);

      expect(updatePhone()).rejects.toThrow(NotFoundException);
    });

    it('throws an error if more than one huelager is returned from the .findHuelagers(): phone number in use', async () => {
      huelagerRepository.findHuelagers.mockResolvedValue([
        mockRejectedHuelager,
        mockFoundHuelager,
      ]);

      expect(updatePhone()).rejects.toThrow(ConflictException);
    });
  });

  describe('verifyPhone', () => {
    const verifyPhone = async () =>
      huelagerService.verifyPhone({
        phone: 'rightPhone',
        otp: 1234,
      });
  });
});
