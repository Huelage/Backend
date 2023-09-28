import { Test, TestingModule } from '@nestjs/testing';

import { VendorResolver } from './vendor.resolver';
import { VendorService } from './vendor.service';

const mockVendorService = () => ({
  create: jest.fn(),
  signIn: jest.fn(),
});

describe('VendorResolver', () => {
  let resolver;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorResolver,
        { provide: VendorService, useFactory: mockVendorService },
      ],
    }).compile();

    resolver = module.get<VendorResolver>(VendorResolver);
    service = module.get<VendorService>(VendorService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('signUpVendor', () => {
    it('calls the create service; creates a vendor and returns the vendor ', async () => {
      service.create.mockResolvedValue('mockVendor');

      const result = await resolver.signUpVendor('mockInput');

      expect(service.create).toHaveBeenCalledWith('mockInput');
      expect(result).toEqual('mockVendor');
    });
  });

  describe('signInVendor', () => {
    it('calls the signIn service; signs in a vendor and returns the vendor ', async () => {
      service.signIn.mockResolvedValue('mockVendor');

      const result = await resolver.signInVendor('mockInput');

      expect(service.signIn).toHaveBeenCalledWith('mockInput');
      expect(result).toEqual('mockVendor');
    });
  });
});
