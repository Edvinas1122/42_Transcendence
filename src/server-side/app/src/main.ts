import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/*
  Configuring CORS
  https://docs.nestjs.com/security/cors
  allows api to be accessed from localhost:3030 - frontend
*/
const corsConfig = {
  origin: 'http://localhost:3030',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig); // enable cors
  await app.listen(3000);
}
bootstrap();
