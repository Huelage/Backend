import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from '../dtos/create-account.dto';
import { AuthenticateUserDto } from '../dtos/authenticate-account.dto';
import { Huelager } from '../entities/huelager.entity';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  async signUpUser(@Args('input') createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Mutation(() => User)
  async signInUser(
    @Args('input') authenticateUserDto: AuthenticateUserDto,
  ): Promise<User | Huelager> {
    return await this.userService.signIn(authenticateUserDto);
  }
}
