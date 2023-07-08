import { Controller, Get, Req, Post, Body, Param, Delete, NotFoundException, Inject, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateChatDto, ChatIdDto, ChatDto, UpdateChatDto, JoinChatDto } from './dtos/chat.dtos'; // import DTOs
import { EventService } from '../events/events.service';
import { OwnerGuard } from './guards/owner.guard';
import { UserId } from '../utils/user-id.decorator';

interface EntityUpdateResponse {
	title: string;
	message: string;
}

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
	) {}

	@Get('available')
	async findAvailableChats(
		@UserId() UserId: number
	): Promise<ChatDto[]> {
		const chats = await this.chatService.getAllUserChats(UserId);
		return chats;
	}


	@Post('create')
	async createChat(
		@UserId() userId: number,
		@Body(new ValidationPipe({ transform: true })) createChatDto: CreateChatDto
	): Promise<Chat | null>
	{
		console.log('create chat', userId);
		createChatDto.ownerID = userId;
		createChatDto.invitedUsersID = createChatDto.invitedUsersID ? [...createChatDto.invitedUsersID, userId] : [userId];
		const resultChat = await this.chatService.createGroupChat(createChatDto);
		if (resultChat) {
			return resultChat;
		}
		return null;
	}

	@UseGuards(OwnerGuard)
	@Post(':chatId/edit')
	async editChat(
		@UserId() userId: number,
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Body(new ValidationPipe({ transform: true })) updateChatDto: UpdateChatDto
	): Promise<EntityUpdateResponse | null>
	{
		console.log('edit chat');
		const resultChat = await this.chatService.editChat(chatId, updateChatDto);
		if (resultChat) {
			const response: EntityUpdateResponse = {
				title: 'Password updated',
				message: `Chat ${resultChat.name} has been updated`
			};
			return response;
		}
		return null;
	}
}
