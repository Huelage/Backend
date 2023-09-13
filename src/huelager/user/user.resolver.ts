import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from '../dtos/create-account.dto';
import { VerifyPhoneDto } from '../dtos/verify-phone.dto';
import { UpdatePhoneDto } from '../dtos/update-phone.dto';
import { AuthenticateUserDto } from '../dtos/authenticate-account.dto';
import { AuthService } from '../auth.service';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { Huelager } from '../entities/huelager.entity';

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

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

  @Mutation(() => Huelager)
  async updateUserPhone(
    @Args('input') updatePhoneDto: UpdatePhoneDto,
  ): Promise<Huelager> {
    return await this.userService.updatePhone(updatePhoneDto);
  }

  @Mutation(() => Huelager)
  async verifyUserPhone(
    @Args('input') verifyPhoneDto: VerifyPhoneDto,
  ): Promise<Huelager> {
    return await this.userService.verifyPhone(verifyPhoneDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Mutation(() => String)
  async refreshUserToken(@Context('req') req) {
    return await this.authService.refreshToken(req.user);
  }
}
