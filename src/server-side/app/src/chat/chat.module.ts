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
import { MessagesController } from './message.controller';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { UsersService } from '../users/users.service';

@Module({
	imports: [TypeOrmModule.forFeature([Chat, Message, User, Role])],
	controllers: [ChatController, MessagesController, RolesController],
	providers: [ChatService, RoleService , MessageService, UsersService, EventsGateway],
	exports: [ChatService, MessageService, RoleService],
})
export class ChatModule {}
