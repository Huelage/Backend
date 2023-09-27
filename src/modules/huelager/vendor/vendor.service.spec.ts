import { Test, TestingModule } from '@nestjs/testing';

import { VendorService } from './vendor.service';
import { HuelagerRepository } from '../huelager.repository';
import { HuelagerService } from '../huelager.service';
import { SmsService } from '../../../providers/sms.service';

const mockHuelagerRepository = () => ({
  findHuelager: jest.fn(),
  save: jest.fn(),
});

const mockSmsService = () => ({
  sendSms: jest.fn(),
});

const mockHuelagerService = () => ({});

describe('VendorService', () => {
  let service: VendorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorService,
        { provide: HuelagerRepository, useFactory: mockHuelagerRepository },
        { provide: SmsService, useFactory: mockSmsService },
        { provide: HuelagerService, useFactory: mockHuelagerService },
      ],
    }).compile();

    service = module.get<VendorService>(VendorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
