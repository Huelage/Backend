import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
// import { CreateUserDto } from './auth/dto/create-user.dto';
import { VerifyPhoneDto } from '../dtos/verify-phone.dto';
import { UpdatePhoneDto } from '../dtos/update-phone.dto';
import { AuthenticateUserDto } from '../dtos/authenticate-user.dto';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

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
