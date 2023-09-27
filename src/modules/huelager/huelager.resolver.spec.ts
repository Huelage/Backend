import { Test, TestingModule } from '@nestjs/testing';
import { HuelagerResolver } from './huelager.resolver';
import { HuelagerService } from './huelager.service';

const mockHuelagerService = () => ({});

describe('HuelagerResolver', () => {
  let resolver: HuelagerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HuelagerResolver,
        { provide: HuelagerService, useFactory: mockHuelagerService },
      ],
    }).compile();

    resolver = module.get<HuelagerResolver>(HuelagerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
