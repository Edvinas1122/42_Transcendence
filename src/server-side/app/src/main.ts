import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig); // enable cors
  await app.listen(3000);
}
bootstrap();
