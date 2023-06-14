import { Controller, Get, Req, Post, Param, Body, UseGuards } from '@nestjs/common';
import { MessageService, MessageDto } from './message.service';
import { Message } from './entities/message.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { SendMessagetDto } from './dtos/chat.dtos';
import { PermitedChatGuard } from './guards/permited.guard';
import { UserId } from '../utils/user-id.decorator';

@UseGuards(JwtAuthGuard)
@Controller('chat/messages')
export class MessagesController {
	constructor(private readonly messageService: MessageService) {}

	@UseGuards(PermitedChatGuard)
	@Get(':chatId')
	async getChatMessages(@UserId() userId: number, @Param('chatId') chatId: number): Promise<MessageDto[]>
	{
		return await this.messageService.getChatMessages(chatId);
	}

	@UseGuards(PermitedChatGuard)
	@Post(':chatId')
	async sendMessage(@UserId() userId: number, @Param('chatId') chatId: number, @Body() message: SendMessagetDto): Promise<MessageDto>
	{
		console.log('getting message', message);
		return await this.messageService.sendMessageToChat(message.content, userId, message.password, chatId);
	}

	@Post('user/:recipientId')
	async sendMessageToUser(@UserId() senderId: number, @Param('recipientId') recipientId: number, @Body() message: SendMessagetDto): Promise<MessageDto>
	{
		return await this.messageService.sendMessageToUser(message.content, senderId, recipientId);
	}
}