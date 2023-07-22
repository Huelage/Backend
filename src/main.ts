import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe(),
  ); /** A Global Pipe for input validation*/

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // logger.log(`Application listening on port ${port}`); // production
  logger.verbose(
    `\nApplication listening on port ${port} \nView the graphlQL playground on http://localhost:${port}/graphql/`,
  );
}
bootstrap();
