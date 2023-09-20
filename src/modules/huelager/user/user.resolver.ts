import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserInput } from '../dtos/create-account.dto';
import { AuthenticateUserInput } from '../dtos/authenticate-account.dto';
import { Huelager } from '../entities/huelager.entity';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  async signUpUser(
    @Args('input') createUserDto: CreateUserInput,
  ): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Mutation(() => User)
  async signInUser(
    @Args('input') authenticateUserDto: AuthenticateUserInput,
  ): Promise<User | Huelager> {
    return await this.userService.signIn(authenticateUserDto);
  }
}
