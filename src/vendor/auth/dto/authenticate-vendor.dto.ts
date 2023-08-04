import { InputType } from '@nestjs/graphql';
import { AuthenticateUserDto } from 'src/user/auth/dto/authenticate-user.dto';

@InputType('AuthenticateVendorInput')
export class AuthenticateVendorDto extends AuthenticateUserDto {}
