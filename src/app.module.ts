import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ApolloDriverConfig } from '@nestjs/apollo';

import { ProvidersModule } from './providers/providers.module';
import { graphqlConfig } from './config/graphql.config';
import { HuelagersModule } from './modules/huelager/huelagers.module';
import { join } from 'path';
import { ImageUploadModule } from './modules/image_upload/image_upload.module';
import { FileUploadModule } from './file_upload/file_upload.module';
import cloudinaryConfig from './config/cloudinary.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cloudinaryConfig],
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

    ProvidersModule,
    HuelagersModule,
    FileUploadModule,
    ImageUploadModule,
  ],
})
export class AppModule {}
