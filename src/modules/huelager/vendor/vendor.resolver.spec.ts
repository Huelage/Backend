import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked } from '@golevelup/ts-jest';

import { VendorResolver } from './vendor.resolver';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.entity';
import { CreateVendorInput } from '../dtos/create-account.input';
import { AuthenticateVendorInput } from '../dtos/authenticate-account.input';

const mockVendorService = () => ({
  create: jest.fn(),
  signIn: jest.fn(),
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

  describe('signUpVendor', () => {
    const vendor = new Vendor();
    const createVendorInput = new CreateVendorInput();

    it('calls the create service; creates a vendor and returns the vendor ', async () => {
      service.create.mockResolvedValue(vendor);

      const result = await resolver.signUpVendor(createVendorInput);

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

      expect(service.signIn).toHaveBeenCalledWith(vendor);
      expect(result).toStrictEqual(vendor);
    });
  });
});
