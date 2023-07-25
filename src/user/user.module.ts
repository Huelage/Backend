import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UtilsModule } from 'src/utils/utils.module';
import { SmsService } from 'src/utils/sms.service';

@Module({
  imports: [
    PassportModule,
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET, // this did not work because the .env filr hadn't yet been read
    //   signOptions: {
    //     expiresIn: 7200,
    //   },
    // }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 7200,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    UtilsModule,
  ],

  providers: [UserService, UserResolver, SmsService],
})
export class UserModule {}
