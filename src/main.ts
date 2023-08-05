import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  ); /** A Global Pipe for input validation*/

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.verbose(
    `\nApplication listening on port ${port} \nView the graphlQL playground on http://localhost:${port}/graphql/`,
  );
}
bootstrap();
