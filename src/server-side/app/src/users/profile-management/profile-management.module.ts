import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relationship } from './entities/relationship.entity';
import { ProfileManagementService } from './profile-management.service';
import { ProfileManagementController } from './profile-management.controller';
import { EventsGateway } from '../../events/events.gateway';
import { UsersModule } from '../users.module';

@Module({
	  imports: [TypeOrmModule.forFeature([Relationship]), UsersModule],
	  controllers: [ProfileManagementController],
	  providers: [ProfileManagementService, EventsGateway],
	  exports: [ProfileManagementService],
})
export class ProfileManagementModule {}
