import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => User)
  userSignUp(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(createUserDto);
  }
}
