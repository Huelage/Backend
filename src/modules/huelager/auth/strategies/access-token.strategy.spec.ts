import { Test } from '@nestjs/testing';
import { DeepMocked } from '@golevelup/ts-jest';

import { AccessTokenStrategy } from './access-token.strategy';
import { HuelagerRepository } from '../../huelager.repository';
import { ConfigService } from '@nestjs/config';

const mockHuelagerRepository = () => ({
  findHuelager: jest.fn(),
});

const mockConfigService = () => ({
  findHuelager: jest.fn(),
});

describe('AccessTokenStrategy', () => {
  let accessTokenStrategy: AccessTokenStrategy;
  let huelagerRepository: DeepMocked<HuelagerRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccessTokenStrategy,
        { provide: HuelagerRepository, useFactory: mockHuelagerRepository },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    accessTokenStrategy = module.get<AccessTokenStrategy>(AccessTokenStrategy);
    huelagerRepository = module.get(HuelagerRepository);
  });

  it('should be defined', () => {
    expect(accessTokenStrategy).toBeDefined();
  });
});
