import { Test, TestingModule } from '@nestjs/testing';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

const mockUserService = () => ({
  create: jest.fn(),
  signIn: jest.fn(),
});

describe('UserResolver', () => {
  let resolver;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useFactory: mockUserService },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('signUpUser', () => {
    it('calls the create service; creates a user and returns the user ', async () => {
      service.create.mockResolvedValue('mockUser');

      const result = await resolver.signUpUser('mockInput');

      expect(service.create).toHaveBeenCalledWith('mockInput');
      expect(result).toEqual('mockUser');
    });
  });

  describe('signInUser', () => {
    it('calls the signIn service; signs in a user and returns the user ', async () => {
      service.signIn.mockResolvedValue('mockUser');

      const result = await resolver.signInUser('mockInput');

      expect(service.signIn).toHaveBeenCalledWith('mockInput');
      expect(result).toEqual('mockUser');
    });
  });
});
