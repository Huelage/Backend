import { InputType } from '@nestjs/graphql';
import { CreateUserDto } from 'src/user/auth/dto/create-user.dto';

@InputType('CreateVendorInput')
export class CreateVendorDto extends CreateUserDto {}
