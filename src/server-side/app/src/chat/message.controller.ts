import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';

@Controller('messages')
export class MessagesController {
	constructor(private readonly messageService: MessageService) {}

	@Get('chats/:chatId')
	async getChatMessages(@Param('chatId') chatId: number): Promise<Message[]> {
		return await this.messageService.getChatMessages(chatId);
	}

	@Post('chats/:chatId')
	async sendMessageToChat(@Param('chatId') chatId: number, @Body() body): Promise<Message> {
		return await this.messageService.sendMessageToChat(body.content, body.senderId, chatId);
	}

	@Post('users/:recipientId')
	async sendMessageToUser(@Param('recipientId') recipientId: number, @Body() body): Promise<Message> {
		return await this.messageService.sendMessageToUser(body.content, body.senderId, recipientId);
	}
}