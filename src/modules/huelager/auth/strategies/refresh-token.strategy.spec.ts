import { Test } from '@nestjs/testing';

import { Request } from 'express';

import { RefreshTokenStrategy } from './refresh-token.strategy';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

process.env = {
  JWT_REFRESH_SECRET: 'testSecret',
};

describe('RefreshTokenStrategy', () => {
  let strategy: RefreshTokenStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RefreshTokenStrategy],
    }).compile();

    strategy = module.get<RefreshTokenStrategy>(RefreshTokenStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const payLoad: JwtPayload = { entityId: 'testId' };
    const req = {
      get(name: string) {
        if (name === 'Authorization') return 'Bearer testToken';
        return;
      },
    };
    jest.spyOn(req, 'get');
    const validate = () => strategy.validate(req as Request, payLoad);

    it('validates and returns the refresh token and the entityId', () => {
      const result = validate();

      expect(req.get).toHaveBeenCalledTimes(1);
      expect(req.get).toHaveBeenCalledWith('Authorization');

      expect(result).toStrictEqual({
        entityId: 'testId',
        refreshToken: 'testToken',
      });
    });
  });
});
