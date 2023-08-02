import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';

@Resolver()
export class AuthResolver {
  constructor(private userService: AuthService) {}

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
  async updatePhone(
    @Args('input') updatePhoneDto: UpdatePhoneDto,
  ): Promise<User> {
    return await this.userService.updatePhone(updatePhoneDto);
  }

  @Mutation(() => User)
  async verifyPhone(
    @Args('input') verifyPhoneDto: VerifyPhoneDto,
  ): Promise<User> {
    return await this.userService.verifyPhone(verifyPhoneDto);
  }
}
