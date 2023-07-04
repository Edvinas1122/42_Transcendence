import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
	providers: [SocketGateway],
	exports: [SocketGateway],
})

export class SocketModule {}

