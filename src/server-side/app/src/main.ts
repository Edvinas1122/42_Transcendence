import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig); // enable cors
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
