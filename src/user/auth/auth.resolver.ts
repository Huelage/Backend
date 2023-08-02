import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';

@Resolver()
export class AuthResolver {
  constructor(private userService: AuthService) {}

  @Query((returns) => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => User)
  async signUpUser(@Args('input') createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Mutation((returns) => User)
  async updatePhone(
    @Args('input') updatePhoneDto: UpdatePhoneDto,
  ): Promise<User> {
    return await this.userService.updatePhone(updatePhoneDto);
  }

  @Mutation((returns) => User)
  async verifyPhone(
    @Args('input') verifyPhoneDto: VerifyPhoneDto,
  ): Promise<User> {
    return await this.userService.verifyPhone(verifyPhoneDto);
  }
}
