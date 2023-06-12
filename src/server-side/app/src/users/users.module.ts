import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Chat } from '../chat/entities/chat.entity';
import { EventsModule } from '../events/events.module';
// import { Message } from '../chat/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository]), EventsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
