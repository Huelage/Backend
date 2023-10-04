import { Test } from '@nestjs/testing';
import { DeepMocked } from '@golevelup/ts-jest';

import { AccessTokenStrategy } from './access-token.strategy';
import { HuelagerRepository } from '../../huelager.repository';
import { Huelager } from '../../entities/huelager.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UnauthorizedException } from '@nestjs/common';

process.env = {
  JWT_ACCESS_SECRET: 'testSecret',
};

const mockHuelagerRepository = () => ({
  findHuelager: jest.fn(),
});

describe('AccessTokenStrategy', () => {
  let strategy: AccessTokenStrategy;
  let huelagerRepository: DeepMocked<HuelagerRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccessTokenStrategy,
        { provide: HuelagerRepository, useFactory: mockHuelagerRepository },
      ],
    }).compile();

    strategy = module.get<AccessTokenStrategy>(AccessTokenStrategy);
    huelagerRepository = module.get(HuelagerRepository);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const huelager = new Huelager();
    const payLoad: JwtPayload = { entityId: 'testId' };
    const validate = async () => strategy.validate(payLoad);

    it('validates and returns the huelager from the JWT payload', async () => {
      huelagerRepository.findHuelager.mockResolvedValue(huelager);

      const result = await validate();

      expect(huelagerRepository.findHuelager).toHaveBeenCalledTimes(1);
      expect(huelagerRepository.findHuelager).toHaveBeenCalledWith({
        where: { entityId: 'testId' },
      });

      expect(result).toStrictEqual(huelager);
    });

    it('throws an unauthorized error if the huelager is not found', async () => {
      huelagerRepository.findHuelager.mockResolvedValue(null);

      expect(validate()).rejects.toThrow(UnauthorizedException);
    });
  });
});
