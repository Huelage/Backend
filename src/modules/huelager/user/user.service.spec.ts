import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from './user.service';
import { HuelagerRepository } from '../huelager.repository';
import { SmsService } from '../../../providers/sms.service';
import { HuelagerService } from '../huelager.service';

const mockHuelagerRepository = () => ({
  findHuelager: jest.fn(),
  save: jest.fn(),
});

const mockSmsService = () => ({
  sendSms: jest.fn(),
});

const mockHuelagerService = () => ({});

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: HuelagerRepository, useFactory: mockHuelagerRepository },
        { provide: SmsService, useFactory: mockSmsService },
        { provide: HuelagerService, useFactory: mockHuelagerService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
