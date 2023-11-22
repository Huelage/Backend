import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

import { env } from './config/env.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  ); /** A Global Pipe for input validation*/

  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  );

  await app.listen(env.port);

  logger.log(`\n\nApplication listening on port ${env.port}, HuelageBackend🚀`);
}
bootstrap();
