import { CreateUserDto } from './create-user.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType('UpdateUserType')
export class UpdateUserDto extends PartialType(CreateUserDto) {}
