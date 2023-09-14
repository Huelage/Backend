import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ApolloDriverConfig } from '@nestjs/apollo';

import { UtilsModule } from './utils/utils.module';
import { graphqlConfig } from './config/graphql.config';
import { HuelagersModule } from './huelager/huelagers.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME, //database name replace with your database name but it should be 'root'
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: true,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    }),

    UtilsModule,
    HuelagersModule,
  ],
})
export class AppModule {}
