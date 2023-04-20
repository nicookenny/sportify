import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('combined'));
  app.use(helmet());
  app.use(json({ limit: '100mb' }));

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 4001, () =>
    console.log('Application is listening on port 4001.'),
  );
}

bootstrap();
