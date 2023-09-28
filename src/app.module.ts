import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ApolloDriverConfig } from '@nestjs/apollo';

import { ProvidersModule } from './providers/providers.module';
import { graphqlConfig } from './config/graphql.config';
import { HuelagersModule } from './modules/huelager/huelagers.module';
import { ImageUploadModule } from './modules/image_upload/image_upload.module';
import { FileUploadModule } from './file_upload/file_upload.module';
import cloudinaryConfig from './config/cloudinary.config';
import typeormConfig from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cloudinaryConfig, typeormConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),

    ProvidersModule,
    HuelagersModule,
    FileUploadModule,
    ImageUploadModule,
  ],
})
export class AppModule {}
