import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserInput } from '../dtos/create-account.input';
import { AuthenticateUserInput } from '../dtos/authenticate-account.input';
import { Huelager } from '../entities/huelager.entity';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  async signUpUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  async signInUser(
    @Args('input') authenticateUserInput: AuthenticateUserInput,
  ): Promise<User | Huelager> {
    return await this.userService.signIn(authenticateUserInput);
  }
}
