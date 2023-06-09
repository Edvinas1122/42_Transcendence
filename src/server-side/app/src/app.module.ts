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

@Module({
	imports: [
		TypeOrmModule.forRoot(typeOrmConfig),
		AuthModule,
		ProfileManagementModule,
		EventsModule,
		ChatModule,
		DriveModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
