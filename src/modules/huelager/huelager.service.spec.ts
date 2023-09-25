import { Test } from '@nestjs/testing';
import { HuelagerService } from './huelager.service';
import { HuelagerRepository } from './huelager.repository';
import { SmsService } from '../../providers/sms.service';
import { EmailService } from '../../providers/email.service';
import { JwtService } from '@nestjs/jwt';

const mockHuelagerRepository = () => ({
  createHuelager: jest.fn(),
});

const mockSmsService = () => ({});

const mockEmailService = () => ({});

const mockJwtService = () => ({});

describe('HuelagerService', () => {
  let huelagerService: HuelagerService;
  let huelagerRepository: HuelagerRepository;

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
  });

  describe('getTokens', () => {
    it('It returns the access and refresh tokens', () => {
      expect(huelagerRepository.createHuelager).not.toHaveBeenCalled();
    });
  });
});
