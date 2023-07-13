import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { UtilsModule } from './utils/utils.module';
import { SmsModule } from './utils/notification/sms.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type:"mysql",
      host:process.env.DB_HOST,
      port:3306,
      username:process.env.DB_USER,
      password:process.env.DB_PASS,
      database:process.env.DB_NAME, //database name replace with your database name but it should be same as this name
      autoLoadEntities:true,
      synchronize:true,
      entities: ["dist/**/*.entity{.ts,.js}"],

    }),
    UserModule,
    UtilsModule,
    SmsModule
  ]
})
export class AppModule {}
