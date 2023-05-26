import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const corsConfig = {
  origin: 'http://localhost:3030',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig);
  await app.listen(3000);
}
bootstrap();
