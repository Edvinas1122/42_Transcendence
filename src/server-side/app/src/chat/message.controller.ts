import { Controller, Get, Req, Post, Param, Body, UseGuards } from '@nestjs/common';
import { MessageService, MessageDto } from './message.service';
import { Message } from './entities/message.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { SendMessagetDto } from './dtos/chat.dtos';
import { PermitedChatGuard } from './guards/permited.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat/messages')
export class MessagesController {
	constructor(private readonly messageService: MessageService) {}

	@UseGuards(PermitedChatGuard)
	@Get(':chatId')
	async getChatMessages(@Req() req: Request, @Param('chatId') chatId: number): Promise<MessageDto[]> {
		const userId = req['user']['id'];
		return await this.messageService.getChatMessages(chatId);
	}

	@UseGuards(PermitedChatGuard)
	@Post(':chatId')
	async sendMessage(@Req() req: Request, @Param('chatId') chatId: number, @Body() message: SendMessagetDto): Promise<MessageDto> {
		const userId = req['user']['id'];
		console.log('getting message', message);
		return await this.messageService.sendMessageToChat(message.content, userId, message.password, chatId);
	}

	@Post('user/:recipientId')
	async sendMessageToUser(@Req() req: Request, @Param('recipientId') recipientId: number, @Body() message: SendMessagetDto): Promise<MessageDto> {
		const senderId = req['user']['id'];
		return await this.messageService.sendMessageToUser(message.content, senderId, recipientId);
	}
}