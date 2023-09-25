import { Test } from '@nestjs/testing';
import { HuelagerService } from './huelager.service';
import { HuelagerRepository } from './huelager.repository';
import { SmsService } from '../../providers/sms.service';
import { EmailService } from '../../providers/email.service';
import { JwtService } from '@nestjs/jwt';

const mockHuelager = {
  hashedRefreshToken:
    '$2a$10$Z74JD5A3U32/qNw4Ilh.4uzK62KCiOWi58xY0S0106UZfloKZOP7q',
};

const mockHuelagerRepository = () => ({
  findHuelager: jest.fn(),
});

const mockSmsService = () => ({});

const mockEmailService = () => ({});

const mockJwtService = () => ({
  signAsync: jest.fn(),
});

describe('HuelagerService', () => {
  let huelagerService;
  let huelagerRepository;
  let jwtService;

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

    jwtService.signAsync.mockResolvedValue('testHash');
    huelagerRepository.findHuelager.mockResolvedValue(mockHuelager);
  });

  describe('getTokens', () => {
    it('returns the access and refresh tokens got from the jwtService.signAsync() function called twice', async () => {
      expect(jwtService.signAsync).not.toHaveBeenCalled();
      const result = await huelagerService.getTokens('testId');
      expect(jwtService.signAsync).toHaveBeenCalled();

      expect(result).toEqual({
        accessToken: 'testHash',
        refreshToken: 'testHash',
      });
    });
  });

  describe('refreshToken', () => {
    it('retrieves the huelager from the database with the findHuelager method', async () => {
      const result = await huelagerService.refreshToken({
        entity: 'testId',
        refreshToken: 'penny and dime.',
      });
      expect(result).toEqual('testHash');
    });

    // it('throws an error if huelager is not found', () => {});
  });
});
