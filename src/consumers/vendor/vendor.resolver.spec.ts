import { Test, TestingModule } from '@nestjs/testing';
import { VendorResolver } from './vendor.resolver';

describe('VendorResolver', () => {
  let resolver: VendorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorResolver],
    }).compile();

    resolver = module.get<VendorResolver>(VendorResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
