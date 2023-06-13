import { Module } from '@nestjs/common';
import { EventsController } from './events.gateway';
import { EventService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
// import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventService],
  controllers: [EventsController],
  exports: [EventService],
})
export class EventsModule {}