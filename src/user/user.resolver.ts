import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => User)
  async userSignUp(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Mutation((returns) => User)
  async updatePhone(
    @Args('updatePhoneDto') updatePhoneDto: UpdatePhoneDto,
  ): Promise<User> {
    return await this.userService.updatePhone(updatePhoneDto);
  }

  @Mutation((returns) => User)
  async verifyPhone(
    @Args('verifyPhoneDto') verifyPhoneDto: VerifyPhoneDto,
  ): Promise<User> {
    return await this.userService.verifyPhone(verifyPhoneDto);
  }
}
