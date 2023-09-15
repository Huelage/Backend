import { Test, TestingModule } from '@nestjs/testing';
import { HuelagerResolver } from './huelager.resolver';

describe('HuelagerResolver', () => {
  let resolver: HuelagerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HuelagerResolver],
    }).compile();

    resolver = module.get<HuelagerResolver>(HuelagerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
