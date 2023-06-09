import { Module } from '@nestjs/common';
import { DriveController } from './drive.controller';
import { UsersModule } from '../users/users.module';

@Module({
	  imports: [UsersModule],
	controllers: [DriveController],
})
export class DriveModule {}