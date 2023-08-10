import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from '../dtos/create-account.dto';
import { VerifyPhoneDto } from '../dtos/verify-phone.dto';
import { UpdatePhoneDto } from '../dtos/update-phone.dto';
import { AuthenticateUserDto } from '../dtos/authenticate-account.dto';
import { AuthService } from '../auth/auth.service';
import { Req, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';

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
  ): Promise<User> {
    return await this.userService.signIn(authenticateUserDto);
  }

  @Mutation(() => User)
  async updateUserPhone(
    @Args('input') updatePhoneDto: UpdatePhoneDto,
  ): Promise<User> {
    return await this.userService.updatePhone(updatePhoneDto);
  }

  @Mutation(() => User)
  async verifyUserPhone(
    @Args('input') verifyPhoneDto: VerifyPhoneDto,
  ): Promise<User> {
    return await this.userService.verifyPhone(verifyPhoneDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Mutation(() => Boolean)
  async refreshUserToken(@Context('req') req) {
    console.log(req.user);

    return true;
  }
}
