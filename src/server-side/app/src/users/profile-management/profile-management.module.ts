import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relationship } from './entities/relationship.entity';
import { ProfileManagementService } from './profile-management.service';
import { ProfileManagementController } from './profile-management.controller';
import { UsersModule } from '../users.module';

@Module({
	  imports: [TypeOrmModule.forFeature([Relationship]), UsersModule],
	  controllers: [ProfileManagementController],
	  providers: [ProfileManagementService],
	  exports: [ProfileManagementService],
})
export class ProfileManagementModule {}
