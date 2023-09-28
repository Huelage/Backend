import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from './user.service';
import { HuelagerRepository } from '../huelager.repository';
import { SmsService } from '../../../providers/sms.service';
import { HuelagerService } from '../huelager.service';
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
}));
const mockHuelagerRepository = () => ({
  checkEmailAndPhone: jest.fn(),
  createHuelager: jest.fn(),
  removeHuelager: jest.fn(),

  createUser: jest.fn(),
  saveUser: jest.fn(),
  findUser: jest.fn(),
});

const mockSmsService = () => ({
  sendSms: jest.fn(),
});

const mockHuelagerService = () => ({
  getTokens: jest.fn(),
});

describe('UserService', () => {
  let service;
  let huelagerRepository;
  let huelagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: HuelagerRepository, useFactory: mockHuelagerRepository },
        { provide: SmsService, useFactory: mockSmsService },
        { provide: HuelagerService, useFactory: mockHuelagerService },
      ],
    }).compile();

    service = await module.get<UserService>(UserService);
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
      firstName: 'testFirstName',
      lastName: 'testLastName',
      phone: 'testPhone',
      password: 'testPassword',
      email: 'testEmail',
    };

    const mockHuelagerInput = {
      phone: mockCreateInput.phone,
      email: mockCreateInput.email,
      password: 'testHash',
      entityType: 'user',
      otp: 1234,
    };

    const mockReturnHuelager = {
      ...mockHuelagerInput,
      entityId: 'testId',
    };

    const mockUser = {
      entity: mockReturnHuelager,
      firstName: mockCreateInput.firstName,
      lastName: mockCreateInput.lastName,
      userId: mockReturnHuelager.entityId,
    };
    const create = async () => service.create(mockCreateInput);

    it('creates the user after creating an entity and returns the user', async () => {
      huelagerRepository.checkEmailAndPhone.mockResolvedValue(null);
      huelagerRepository.createHuelager.mockResolvedValue(mockReturnHuelager);
      huelagerRepository.createUser.mockResolvedValue(mockUser);

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
      expect(huelagerRepository.createUser).toHaveBeenCalledWith(mockUser);

      expect(result).toEqual(mockUser);
    });

    it('throws a conflict exception error if a user with the phone or email exists', async () => {
      huelagerRepository.checkEmailAndPhone.mockResolvedValue({
        emailExists: false,
        phoneExists: false,
      });

      expect(create()).rejects.toThrow(ConflictException);
    });

    it('throws an error with a status code of 422 if user does not save', async () => {
      huelagerRepository.checkEmailAndPhone.mockResolvedValue(null);
      huelagerRepository.createHuelager.mockResolvedValue(mockReturnHuelager);
      huelagerRepository.createUser.mockResolvedValue(mockUser);
      huelagerRepository.saveUser.mockRejectedValue('mockValue');

      expect(create()).rejects.toThrow(HttpException);
    });
  });

  describe('signIn', () => {
    const mockFoundUser = {
      entity: {
        password: 'testHash',
        isVerified: true,
      },
    };

    const mockReturnedUser = {
      entity: {
        password: 'testHash',
        accessToken: 'testToken',
        refreshToken: 'testToken',
        isVerified: true,
        hashedRefreshToken: 'testHash',
      },
    };
    it('signs in the user with the entityId  by confirming the credentials and returning the user object', async () => {
      huelagerRepository.findUser.mockReturnValue(mockFoundUser);
      (compare as jest.MockedFunction<typeof compare>).mockImplementation(
        async () => true,
      );
      huelagerService.getTokens.mockReturnValue({
        accessToken: 'testToken',
        refreshToken: 'testToken',
      });

      const result = await service.signIn({
        entityId: 'testId',
        email: null,
        password: 'testPassword',
      });

      expect(huelagerRepository.findUser).toHaveBeenCalledWith({
        where: { entity: { entityId: 'testId' } },
      });
      expect(result).toEqual(mockReturnedUser);
    });

    it('signs in the user with the email  by confirming the credentials and returning the user object', async () => {
      huelagerRepository.findUser.mockReturnValue(mockFoundUser);
      (compare as jest.MockedFunction<typeof compare>).mockImplementation(
        async () => true,
      );
      huelagerService.getTokens.mockReturnValue({
        accessToken: 'testToken',
        refreshToken: 'testToken',
      });

      const result = await service.signIn({
        entityId: null,
        email: 'testEmail',
        password: 'testPassword',
      });

      expect(huelagerRepository.findUser).toHaveBeenCalledWith({
        where: { entity: { email: 'testEmail' } },
      });
      expect(result).toEqual(mockReturnedUser);
    });

    it('throws a bad request error if neither the email nor entityId field is inputed', async () => {
      const signIn = async () =>
        service.signIn({
          entityId: null,
          email: null,
          password: 'testPassword',
        });
      expect(signIn()).rejects.toThrow(BadRequestException);
    });

    it('throws an unauthorized error if the entityId or email does not exist', async () => {
      huelagerRepository.findUser.mockReturnValue(null);

      const signIn = async () =>
        await service.signIn({
          entityId: 'testId',
          email: 'testEmail',
          password: 'testPassword',
        });
      expect(signIn()).rejects.toThrow(UnauthorizedException);
    });

    it('throws an unauthorized error if the password is incorrect', async () => {
      huelagerRepository.findUser.mockReturnValue(mockFoundUser);
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
