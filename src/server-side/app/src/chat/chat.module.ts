import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { MessageService } from './message.service';
import { ChatService } from './chat.service';
import { EventsGateway } from '../events/events.gateway';
import { ChatController } from './chat.controller';
import { RoleService } from './role.service';
import { Participant } from './entities/participants.entity';
import { MessagesController } from './message.controller';
import { RolesController } from './roles.controller';
import { Admin } from './entities/admin.entity';
import { Invited } from './entities/invited.entity';
import { Blocked } from './entities/blocked.entity';
import { Muted } from './entities/muted.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Chat, Message, User,
				Participant, Admin, Invited, Blocked, Muted])],
	controllers: [ChatController, MessagesController, RolesController],
	providers: [ChatService, RoleService , MessageService, EventsGateway],
	exports: [ChatService, MessageService, RoleService],
})
export class ChatModule {}
