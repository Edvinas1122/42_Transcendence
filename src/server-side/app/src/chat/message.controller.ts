import { Controller, Get, Req, Post, Param, Body, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
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
	async getChatMessages(@Req() req: Request, @Param('chatId') chatId: number): Promise<Message[]> {
		const userId = req['user']['id'];
		return await this.messageService.getChatMessages(chatId);
	}

	@UseGuards(PermitedChatGuard)
	@Post(':chatId')
	async sendMessage(@Req() req: Request, @Param('chatId') chatId: number, @Body() message: SendMessagetDto): Promise<Message> {
		const userId = req['user']['id'];
		return await this.messageService.sendMessageToChat(message.content, userId, message.password, chatId);
	}
}