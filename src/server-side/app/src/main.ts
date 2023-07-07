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

async function bootstrap() {
	// const app = await NestFactory.create(AppModule, { httpsOptions });
	const app = await NestFactory.create(AppModule, {
		forceCloseConnections: true,
		cors: true,	// enable cors
	});

	app.enableCors(corsConfig); // enable cors

	app.enableShutdownHooks();
	app.use(cookieParser());
	await app.listen(3000);
	// await app.listen(3001);

}
bootstrap();
