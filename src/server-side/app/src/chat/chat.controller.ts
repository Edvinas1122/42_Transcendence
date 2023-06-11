import { Controller, Get, Req, Post, Body, Param, Delete, NotFoundException, Inject } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateChatDto, ChatIdDto, ChatDto, UpdateChatDto, JoinChatDto } from './dtos/chat.dtos'; // import DTOs
import { EventService } from '../events/sse.service';
import { PrivilegedGuard } from './guards/owner.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		@Inject(EventService)
		private readonly eventService: EventService,
	) {}

	@Get('available')
	async findAvailableChats(@Req() req: Request): Promise<ChatDto[]> {
		console.log("requesting for all charts" + req['user']['id']);
		const UserId = req['user']['id'];
		const chats = await this.chatService.getUserChats(UserId);
		// const chats = await this.chatService.getChat(1);
		console.log(chats);
		return chats;
		// return await this.chatService.getAllChats();
	}

	@Post('create')
	async createChat(@Req() req: Request, @Body() createChatDto: CreateChatDto): Promise<Chat | null>
	{
		const userId = req['user']['id'];
		// const userId = 1;
		console.log("creating chat for user " + userId);
		// Check if the ID arrays are defined. If not, initialize them as empty arrays.
		createChatDto.ownerID = userId;
		createChatDto.invitedUsersID = createChatDto.invitedUsersID ? [...createChatDto.invitedUsersID, userId] : [userId];
		const resultChat = await this.chatService.createGroupChat(createChatDto);
		if (resultChat)
		{
			this.eventService.sendEventToUser(userId.toString(), {type: 'chat', data: resultChat});
			return resultChat;
		}
		return null;
	}

	@UseGuards(PrivilegedGuard)
	@Delete(':chatId')
	async deleteChat(@Req() req: Request, @Param() chatId: number): Promise<boolean>
	{
		const userId = req['user']['id'];

		const resultChat = await this.chatService.deleteChat(chatId);
		if (!resultChat)
			throw new NotFoundException('Chat not found');
		return resultChat;
	}


}
