import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { HttpsRedirectMiddleware } from './utils/http.middleware';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';

// const httpsOptions = {
//   key: fs.readFileSync('/etc/ssl/certs/key.pem'),
//   cert: fs.readFileSync('/etc/ssl/certs/cert.pem'),
//   // passphrase: 'verynicedog'
// };

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, { httpsOptions });
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsConfig); // enable cors

  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
