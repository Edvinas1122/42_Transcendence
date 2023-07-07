import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ProfileManagementModule } from './users/profile-management/profile-management.module';
// import { EventsGateway } from './events/events.gateway';
import { EventsModule } from './events/events.module';
import { ChatModule } from './chat/chat.module';
import { DriveModule } from './drive/drive.module';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { HttpsRedirectMiddleware } from './utils/http.middleware';
import { SocketModule } from './socket/socket.module';
import { GameModule } from './game/game.module';
import { OnlineStatusModule } from './OnlineStatus/onlineStatus.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(typeOrmConfig),
		AuthModule,
		EventsModule,
		ChatModule,
		DriveModule,
		UsersModule,
		ProfileManagementModule,
		SocketModule,
		GameModule,
		OnlineStatusModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}


// export class AppModule implements NestModule {
// 	configure(consumer: MiddlewareConsumer) {
// 	  consumer
// 		.apply(HttpsRedirectMiddleware)
// 		.forRoutes('*');
// 	}
//   }