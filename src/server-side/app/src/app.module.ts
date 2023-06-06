import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ProfileManagementModule } from './users/profile-management/profile-management.module';
import { EventsGateway } from './events/events.gateway';
import { ChatModule } from './chat/chat.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(typeOrmConfig),
		AuthModule,
		ProfileManagementModule,
		EventsGateway,
		ChatModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
