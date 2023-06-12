import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relationship } from './entities/relationship.entity';
import { ProfileManagementService } from './profile-management.service';
import { ProfileManagementController } from './profile-management.controller';
import { UserEventGateway } from '../user-event.gateway';
import { EventsModule } from '../../events/events.module';

@Module({
	  imports: [TypeOrmModule.forFeature([Relationship]), EventsModule],
	  controllers: [ProfileManagementController],
	  providers: [ProfileManagementService, UserEventGateway],
	  exports: [ProfileManagementService],
})

export class ProfileManagementModule {}
