import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked } from '@golevelup/ts-jest';

import { VendorResolver } from './vendor.resolver';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.entity';
import { CreateVendorInput } from '../dtos/create-account.input';
import { AuthenticateVendorInput } from '../dtos/authenticate-account.input';
import { Huelager } from '../entities/huelager.entity';

const mockVendorService = () => ({
  create: jest.fn(),
  signIn: jest.fn(),
  restructureHuelager: jest.fn(),
});

describe('VendorResolver', () => {
  let resolver: VendorResolver;
  let service: DeepMocked<VendorService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorResolver,
        { provide: VendorService, useFactory: mockVendorService },
      ],
    }).compile();

    resolver = module.get<VendorResolver>(VendorResolver);
    service = module.get(VendorService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getMyVendorProfile', () => {
    const vendor = new Vendor();

    it('calls the restructureHuelager service; returns the vendor.', async () => {
      service.restructureHuelager.mockResolvedValue(vendor);

      const result = await resolver.getMyVendorProfile({
        user: new Huelager(),
      });

      expect(service.restructureHuelager).toHaveBeenCalledTimes(1);
      expect(service.restructureHuelager).toHaveBeenCalledWith(vendor);
      expect(result).toStrictEqual(vendor);
    });
  });

  describe('signUpVendor', () => {
    const vendor = new Vendor();
    const createVendorInput = new CreateVendorInput();

    it('calls the create service; creates a vendor and returns the vendor ', async () => {
      service.create.mockResolvedValue(vendor);

      const result = await resolver.signUpVendor(createVendorInput);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createVendorInput);

      expect(result).toStrictEqual(vendor);
    });
  });

  describe('signInVendor', () => {
    const vendor = new Vendor();
    const authenticateVendorInput = new AuthenticateVendorInput();

    it('calls the signIn service; signs in a vendor and returns the vendor ', async () => {
      service.signIn.mockResolvedValue(vendor);

      const result = await resolver.signInVendor(authenticateVendorInput);

      expect(service.signIn).toHaveBeenCalledTimes(1);
      expect(service.signIn).toHaveBeenCalledWith(vendor);
      expect(result).toStrictEqual(vendor);
    });
  });
});
