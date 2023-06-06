import { Controller, Get, Req, Post, Body, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateChatDto, ChatIdDto, UpdateChatDto, UserChatActionDto } from './dtos/chat.dtos'; // import DTOs

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
	) {}

	@Get('all')
	async findAll(): Promise<Chat[]> {
		return await this.chatService.getAllChats();
	}

	@Get('available')
	async findAvailableChats(@Req() req: Request): Promise<Chat[]> {
		console.log("requesting for all charts" + req['user']['id']);
		const UserId = req['user']['id'];
		const chats = await this.chatService.getUserChats(UserId);
		// const chats = await this.chatService.getChat(1);
		console.log(chats);
		return chats;
		// return await this.chatService.getAllChats();
	}

	@Get('Group')
	async findGroupChats(@Req() req: Request): Promise<Chat[]> {
		const UserId = req['user']['id'];
		const chats = await this.chatService.getUserGroupChats(UserId);
		return chats;
	}

	@Get('Personal')
	async findPersonalChats(@Req() req: Request): Promise<Chat[]> {
		const UserId = req['user']['id'];
		const chats = await this.chatService.getUserPersonalChats(UserId);
		return chats;
	}

	@Get('dummy')
	async findAllDummy(): Promise<Chat[]> {
		const chat = new Chat();
		chat.id = 1;
		chat.name = 'Dummy Chat 1';
		chat.ownerID = 1;
		chat.private = false;
		chat.password = '';
		chat.createdAt = new Date();
		// chat.participantsID = [1, 2];
		// chat.deletedAt = null;
		chat.deleted = false;
		// chat.mutedUsersID = [];
		// chat.bannedUsersID = [];
		// chat.invitedUsersID = [];
		return [chat];
	}

	@Post('create')
	async createChat(@Req() req: Request, @Body() createChatDto: CreateChatDto): Promise<Chat | null>
	{
		const userId = req['user']['id'];
		// const userId = 1;
		console.log("creating chat for user " + userId);
		// Check if the ID arrays are defined. If not, initialize them as empty arrays.
		createChatDto.ownerID = userId;
		createChatDto.participantsID = createChatDto.participantsID ? [...createChatDto.participantsID, userId] : [userId];
		const resultChat = await this.chatService.createChat(createChatDto);
		if (resultChat)
			return resultChat;
		return null;
	}

	@Post('delete')
	async deleteChat(@Req() req: Request, @Body() chatIdDto: ChatIdDto): Promise<boolean>
	{
		const userId = req['user']['id'];

		const resultChat = await this.chatService.deleteChat(chatIdDto.chatId);
		if (!resultChat)
			throw new NotFoundException('Chat not found');
		return resultChat;
	}
}
