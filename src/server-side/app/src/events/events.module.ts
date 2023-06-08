import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsController } from './sse.gateway';
import { EventService } from './sse.service';

@Module({
  providers: [EventsGateway, EventService],
  controllers: [EventsController],
  exports: [EventsGateway, EventService],
})
export class EventsModule {}