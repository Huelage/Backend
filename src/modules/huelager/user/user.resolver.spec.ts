import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked } from '@golevelup/ts-jest';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserInput } from '../dtos/create-account.input';
import { AuthenticateUserInput } from '../dtos/authenticate-account.input';

const mockUserService = () => ({
  create: jest.fn(),
  signIn: jest.fn(),
});

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: DeepMocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useFactory: mockUserService },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('signUpUser', () => {
    const user = new User();
    const createUserInput = new CreateUserInput();

    it('calls the create service; creates a user and returns the user ', async () => {
      service.create.mockResolvedValue(user);

      const result = await resolver.signUpUser(createUserInput);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createUserInput);
      expect(result).toStrictEqual(user);
    });
  });

  describe('signInUser', () => {
    const user = new User();
    const authenticateUserInput = new AuthenticateUserInput();

    it('calls the signIn service; signs in a user and returns the user ', async () => {
      service.signIn.mockResolvedValue(user);

      const result = await resolver.signInUser(authenticateUserInput);

      expect(service.signIn).toHaveBeenCalledTimes(1);
      expect(service.signIn).toHaveBeenCalledWith(authenticateUserInput);
      expect(result).toStrictEqual(user);
    });
  });
});
