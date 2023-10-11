import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserInput } from '../dtos/create-account.input';
import { AuthenticateUserInput } from '../dtos/authenticate-account.input';
import { Huelager } from '../entities/huelager.entity';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../../common/guards/access-token.guard';
import { EditUserLocationInput } from '../dtos/edit-locations.input';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Query(() => User)
  getUserProfile(@Context('req') req) {
    return this.userService.restructureHuelager(req.user);
  }

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

  @UseGuards(AccessTokenGuard)
  @Mutation(() => User)
  async editUserLocation(
    @Context('req') req,
    @Args('input') editUserLocationInput: EditUserLocationInput,
  ) {
    const { entityType, entityId } = req.user as Huelager;

    editUserLocationInput.userId = entityId;
    editUserLocationInput.entityType = entityType;

    return await this.userService.editLocation(editUserLocationInput);
  }
}
