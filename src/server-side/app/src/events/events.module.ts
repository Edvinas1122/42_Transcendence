import { Module } from '@nestjs/common';
import { EventsController } from './sse.gateway';
import { EventService } from './sse.service';

@Module({
  providers: [EventService],
  controllers: [EventsController],
  exports: [EventService],
})
export class EventsModule {}