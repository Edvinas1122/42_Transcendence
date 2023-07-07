import { Module } from '@nestjs/common';
// import { EventService } from '../events/events.service';
import { OnlineStatusService } from './onlineStatus.service';
import { OnlineStatusController } from './onlineStatus.controller';
import { EventsModule } from '../events/events.module';
// import { GameService } from '../game/pongGame.service';
import { GameModule } from '../game/game.module';

@Module({
	imports: [EventsModule, GameModule],
	providers: [OnlineStatusService],
	controllers: [OnlineStatusController],
	exports: [OnlineStatusService],
  })
  export class OnlineStatusModule {}