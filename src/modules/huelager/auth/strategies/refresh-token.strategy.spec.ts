import { Test } from '@nestjs/testing';

import { Request } from 'express';

import { RefreshTokenStrategy } from './refresh-token.strategy';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

describe('RefreshTokenStrategy', () => {
  let refreshTokenStrategy: RefreshTokenStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RefreshTokenStrategy],
    }).compile();

    refreshTokenStrategy =
      module.get<RefreshTokenStrategy>(RefreshTokenStrategy);
  });

  it('should be defined', () => {
    expect(refreshTokenStrategy).toBeDefined();
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
    const validate = () =>
      refreshTokenStrategy.validate(req as Request, payLoad);

    it('validates and returns the huelager from the JWT payload', () => {
      const result = validate();

      expect(req.get).toHaveBeenCalledTimes(1);
      expect(req.get).toHaveBeenCalledWith('Authorization');

      expect(result).toEqual({ entityId: 'testId', refreshToken: 'testToken' });
    });
  });
});
