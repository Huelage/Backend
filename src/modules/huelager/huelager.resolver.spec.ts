import { Test, TestingModule } from '@nestjs/testing';
import { HuelagerResolver } from './huelager.resolver';
import { HuelagerService } from './huelager.service';

const mockHuelagerService = () => ({
  refreshToken: jest.fn(),
  updatePhone: jest.fn(),
  verifyPhone: jest.fn(),
  requestEmailVerification: jest.fn(),
  verifyEmail: jest.fn(),
  forgotPassword: jest.fn(),
  updatePassword: jest.fn(),
  generateRSAKey: jest.fn(),
});

describe('HuelagerResolver', () => {
  let resolver;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HuelagerResolver,
        { provide: HuelagerService, useFactory: mockHuelagerService },
      ],
    }).compile();

    resolver = module.get<HuelagerResolver>(HuelagerResolver);
    service = module.get<HuelagerService>(HuelagerService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('sayHello', () => {
    it('says hello', () => {
      expect(resolver.sayHello()).toEqual('Hello World!');
    });
  });

  describe('refreshAccessToken', () => {
    it('calls the refreshToken service; refreshes the access token and returns it.', async () => {
      service.refreshToken.mockResolvedValue('testToken');

      const result = await resolver.refreshAccessToken({ user: 'mockUser' });

      expect(service.refreshToken).toHaveBeenCalledWith('mockUser');
      expect(result).toEqual('testToken');
    });
  });

  describe('updatePhone', () => {
    it('calls the updatePhone service; updates the hulagers phone number and returns the huelager.', async () => {
      service.updatePhone.mockResolvedValue('mockHuelager');

      const result = await resolver.updatePhone('mockInPut');

      expect(service.updatePhone).toHaveBeenCalledWith('mockInPut');
      expect(result).toEqual('mockHuelager');
    });
  });

  describe('verifyPhoneOtp', () => {
    it('calls the verifyPhone service; verifies the huelager otp and returns the huelager.', async () => {
      service.verifyPhone.mockResolvedValue('mockHuelager');

      const result = await resolver.verifyPhoneOtp('mockInPut');

      expect(service.verifyPhone).toHaveBeenCalledWith('mockInPut');
      expect(result).toEqual('mockHuelager');
    });
  });

  describe('requestEmailVerification', () => {
    it('calls the requestEmailVerification service; requests the email verification and returns the huelager.', async () => {
      service.requestEmailVerification.mockResolvedValue('mockHuelager');

      const result = await resolver.requestEmailVerification('mockInPut');

      expect(service.requestEmailVerification).toHaveBeenCalledWith(
        'mockInPut',
      );
      expect(result).toEqual('mockHuelager');
    });
  });

  describe('verifyEmailOtp', () => {
    it('calls the verifyEmail service; verifies the huelager email and returns the huelager.', async () => {
      service.verifyEmail.mockResolvedValue('mockHuelager');

      const result = await resolver.verifyEmailOtp('mockInPut');

      expect(service.verifyEmail).toHaveBeenCalledWith('mockInPut');
      expect(result).toEqual('mockHuelager');
    });
  });

  describe('forgotPassword', () => {
    it('calls the forgotPassword service; updates the password and returns the huelager.', async () => {
      service.forgotPassword.mockResolvedValue('mockHuelager');

      const result = await resolver.forgotPassword('mockInPut');

      expect(service.forgotPassword).toHaveBeenCalledWith('mockInPut');
      expect(result).toEqual('mockHuelager');
    });
  });

  describe('updatePassword', () => {
    it('calls the updatePassword service; updates the password and returns the huelager.', async () => {
      service.updatePassword.mockResolvedValue('mockHuelager');

      const result = await resolver.updatePassword('mockInPut');

      expect(service.updatePassword).toHaveBeenCalledWith('mockInPut');
      expect(result).toEqual('mockHuelager');
    });
  });

  describe('generateRSAKey', () => {
    it('calls the generateRSAKey service; generate the an RSA key pair and returns the public key.', async () => {
      service.generateRSAKey.mockResolvedValue('mockHuelager');

      const result = await resolver.generateRSAKey({ user: 'mockUser' });

      expect(service.generateRSAKey).toHaveBeenCalledWith('mockUser');
      expect(result).toEqual('mockHuelager');
    });
  });
});
