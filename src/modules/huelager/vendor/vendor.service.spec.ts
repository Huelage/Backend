import { Test, TestingModule } from '@nestjs/testing';

import { VendorService } from './vendor.service';
import { HuelagerRepository } from '../huelager.repository';
import { HuelagerService } from '../huelager.service';
import { SmsService } from '../../../providers/sms.service';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: async () => 'testHash',
}));

jest.mock('../../../common/helpers/helpers.ts', () => ({
  genRandomOtp: () => 1234,
  otpIsExpired: jest.fn(),
  generateVendorKey: () => 'testVendorKey',
}));
const mockHuelagerRepository = () => ({
  checkEmailAndPhone: jest.fn(),
  createHuelager: jest.fn(),
  removeHuelager: jest.fn(),

  createVendor: jest.fn(),
  saveVendor: jest.fn(),
  findVendor: jest.fn(),
});

const mockSmsService = () => ({
  sendSms: jest.fn(),
});

const mockHuelagerService = () => ({
  getTokens: jest.fn(),
});

describe('VendorService', () => {
  let service;
  let huelagerRepository;
  let huelagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorService,
        { provide: HuelagerRepository, useFactory: mockHuelagerRepository },
        { provide: SmsService, useFactory: mockSmsService },
        { provide: HuelagerService, useFactory: mockHuelagerService },
      ],
    }).compile();

    service = await module.get<VendorService>(VendorService);
    huelagerRepository = await module.get<HuelagerRepository>(
      HuelagerRepository,
    );
    huelagerService = await module.get<HuelagerService>(HuelagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockCreateInput = {
      repName: 'testRepName',
      businessAddress: 'testBusinessAddress',
      businessName: 'testBusinessName',
      phone: 'testPhone',
      password: 'testPassword',
      email: 'testEmail',
    };

    const mockHuelagerInput = {
      phone: mockCreateInput.phone,
      email: mockCreateInput.email,
      password: 'testHash',
      entityType: 'vendor',
      otp: 1234,
    };

    const mockReturnHuelager = {
      ...mockHuelagerInput,
      entityId: 'testId',
    };

    const mockVendor = {
      entity: mockReturnHuelager,
      repName: mockCreateInput.repName,
      businessAddress: mockCreateInput.businessAddress,
      businessName: mockCreateInput.businessName,
      vendorId: mockReturnHuelager.entityId,
      vendorKey: 'testVendorKey',
    };
    const create = async () => service.create({ ...mockCreateInput });

    it('creates the vendor after creating an entity and returns the vendor', async () => {
      huelagerRepository.checkEmailAndPhone.mockResolvedValue(null);
      huelagerRepository.createHuelager.mockResolvedValue(mockReturnHuelager);
      huelagerRepository.createVendor.mockResolvedValue(mockVendor);

      const result = await create();

      expect(huelagerRepository.checkEmailAndPhone).toHaveBeenCalledWith({
        where: [
          { email: mockCreateInput.email },
          { phone: mockCreateInput.phone },
        ],
      });
      expect(huelagerRepository.createHuelager).toHaveBeenCalledWith(
        mockHuelagerInput,
      );
      expect(huelagerRepository.createVendor).toHaveBeenCalledWith(mockVendor);

      expect(result).toEqual(mockVendor);
    });

    it('throws a conflict exception error if a vendor with the phone or email exists', async () => {
      huelagerRepository.checkEmailAndPhone.mockResolvedValue({
        emailExists: false,
        phoneExists: false,
      });

      expect(create()).rejects.toThrow(ConflictException);
    });

    it('throws an error with a status code of 422 if vendor does not save', async () => {
      huelagerRepository.checkEmailAndPhone.mockResolvedValue(null);
      huelagerRepository.createHuelager.mockResolvedValue(mockReturnHuelager);
      huelagerRepository.createVendor.mockResolvedValue(mockVendor);
      huelagerRepository.saveVendor.mockRejectedValue('mockValue');

      expect(create()).rejects.toThrow(HttpException);
    });
  });

  describe('signIn', () => {
    const mockFoundVendor = {
      entity: {
        password: 'testHash',
        isVerified: true,
      },
    };

    const mockReturnedVendor = {
      entity: {
        password: 'testHash',
        accessToken: 'testToken',
        refreshToken: 'testToken',
        isVerified: true,
        hashedRefreshToken: 'testHash',
      },
    };

    it('signs in the vendor with the entityId  by confirming the credentials and returning the vendor object', async () => {
      huelagerRepository.findVendor.mockReturnValue(mockFoundVendor);
      (compare as jest.MockedFunction<typeof compare>).mockImplementation(
        async () => true,
      );
      huelagerService.getTokens.mockReturnValue({
        accessToken: 'testToken',
        refreshToken: 'testToken',
      });

      const result = await service.signIn({
        entityId: 'testId',
        vendorKey: null,
        password: 'testPassword',
      });

      expect(huelagerRepository.findVendor).toHaveBeenCalledWith({
        where: { entity: { entityId: 'testId' } },
      });
      expect(result).toEqual(mockReturnedVendor);
    });

    it('signs in the vendor with the vendorKey  by confirming the credentials and returning the vendor object', async () => {
      huelagerRepository.findVendor.mockReturnValue(mockFoundVendor);
      (compare as jest.MockedFunction<typeof compare>).mockImplementation(
        async () => true,
      );
      huelagerService.getTokens.mockReturnValue({
        accessToken: 'testToken',
        refreshToken: 'testToken',
      });

      const result = await service.signIn({
        entityId: null,
        vendorKey: 'testVendorKey',
        password: 'testPassword',
      });

      expect(huelagerRepository.findVendor).toHaveBeenCalledWith({
        where: { vendorKey: 'testVendorKey' },
      });
      expect(result).toEqual(mockReturnedVendor);
    });

    it('throws a bad request error if neither the vendorKey nor entityId field is inputed', async () => {
      const signIn = async () =>
        service.signIn({
          entityId: null,
          vendorKey: null,
          password: 'testPassword',
        });
      expect(signIn()).rejects.toThrow(BadRequestException);
    });

    it('throws an unauthorized error if the entityId or vendorKey does not exist', async () => {
      huelagerRepository.findVendor.mockReturnValue(null);

      const signIn = async () =>
        await service.signIn({
          entityId: 'testId',
          vendorKey: 'testEmail',
          password: 'testPassword',
        });
      expect(signIn()).rejects.toThrow(UnauthorizedException);
    });

    it('throws an unauthorized error if the password is incorrect', async () => {
      huelagerRepository.findVendor.mockReturnValue(mockFoundVendor);
      (compare as jest.MockedFunction<typeof compare>).mockImplementation(
        async () => false,
      );
      const signIn = async () =>
        await service.signIn({
          entityId: 'testId',
          email: 'testEmail',
          password: 'testPassword',
        });
      expect(signIn()).rejects.toThrow(UnauthorizedException);
    });
  });
});
