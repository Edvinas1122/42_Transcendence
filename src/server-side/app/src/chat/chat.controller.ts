import { Controller, Get, Req, Post, Body, Param, Delete, NotFoundException, Inject, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateChatDto, ChatIdDto, ChatDto, UpdateChatDto, JoinChatDto } from './dtos/chat.dtos'; // import DTOs
import { EventService } from '../events/events.service';
import { PrivilegedGuard } from './guards/owner.guard';
import { UserId } from '../utils/user-id.decorator';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		@Inject(EventService)
		private readonly eventService: EventService,
	) {}

	@Get('available')
	async findAvailableChats(@UserId() UserId: number): Promise<ChatDto[]> {
		const chats = await this.chatService.getUserChats(UserId);
		// const chats = await this.chatService.getChat(1);
		return chats;
		// return await this.chatService.getAllChats();
	}

	@Post('create')
	async createChat(@UserId() userId: number, @Body(new ValidationPipe({ transform: true })) createChatDto: CreateChatDto): Promise<Chat | null>
	{
		createChatDto.ownerID = userId;
		createChatDto.invitedUsersID = createChatDto.invitedUsersID ? [...createChatDto.invitedUsersID, userId] : [userId];
		const resultChat = await this.chatService.createGroupChat(createChatDto);
		if (resultChat)
		{
			// this.eventService.sendEventToUser(userId.toString(), {type: 'chat', data: resultChat});
			return resultChat;
		}
		return null;
	}

	@UseGuards(PrivilegedGuard)
	@Delete(':chatId')
	async deleteChat(@UserId() userId: number, @Param('chatId', new ParseIntPipe()) chatId: number): Promise<boolean>
	{
		const resultChat = await this.chatService.deleteChat(chatId);
		if (!resultChat)
			throw new NotFoundException('Chat not found');
		return resultChat;
	}


}
