import { Module } from '@nestjs/common';
// import { EventService } from '../events/events.service';
import { OnlineStatusService } from './onlineStatus.service';
import { OnlineStatusController } from './onlineStatus.controller';
import { EventsModule } from '../events/events.module';
import { SocketModule } from '../socket/socket.module';

@Module({
	imports: [EventsModule, SocketModule],
	providers: [OnlineStatusService],
	controllers: [OnlineStatusController],
	exports: [OnlineStatusService],
  })
  export class OnlineStatusModule {}