import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { HttpsRedirectMiddleware } from './utils/http.middleware';
import * as cookieParser from 'cookie-parser';
import { WebSocketAdapter, WsMessageHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

// const httpsOptions = {
//   key: fs.readFileSync('/etc/ssl/certs/key.pem'),
//   cert: fs.readFileSync('/etc/ssl/certs/cert.pem'),
//   // passphrase: 'verynicedog'
// };

// export class MyWebSocketAdapter implements WebSocketAdapter {

// 	bindClientConnect(server: any, callback: Function) {
		
// 	}
// 	bindMessageHandlers(client: any, handlers: WsMessageHandler<string>[], transform: (data: any) => Observable<any>) {
		
// 	}
// 	create(port: number, options?: any) {
		
// 	}
// 	close(server: any) {}
// }

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, { httpsOptions });
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsConfig); // enable cors

//   app.useWebSocketAdapter(new MyWebSocketAdapter());
  app.use(cookieParser());
  await app.listen(3000);
  // await app.listen(3001);

}
bootstrap();
