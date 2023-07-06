import { Controller, Get, Req, Post, Param, Body, UseGuards, ParseIntPipe, ValidationPipe, Inject } from '@nestjs/common';
import { MessageService, MessageDto } from './message.service';
import { Message } from './entities/message.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { SendMessageDto } from './dtos/chat.dtos';
import { PermitedChatGuard } from './guards/permited.guard';
import { UserId } from '../utils/user-id.decorator';
import { ParticipantGuard } from './guards/participant.guard';
import { MutedSanctionGuard } from './guards/mutedSanction.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat/messages')
export class MessagesController {
	constructor(
		@Inject(MessageService)
		private readonly messageService: MessageService
	) {}

	@UseGuards(ParticipantGuard)
	@Get(':chatId')
	async getChatMessages(
		@UserId() userId: number,
		@Param('chatId', new ParseIntPipe()) chatId: number
	): Promise<MessageDto[]>
	{
		return await this.messageService.getChatMessages(chatId, userId);
	}

	@UseGuards(ParticipantGuard)
	@UseGuards(MutedSanctionGuard)
	@Post(':chatId')
	async sendMessage(
		@UserId() userId: number,
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Body(new ValidationPipe({ transform: true })) message: SendMessageDto
	): Promise<MessageDto>
	{

		return await this.messageService.sendMessageToChat(
			message.content, userId, /*message.password,*/ chatId);
	}

	@Post('user/:recipientId')
	async sendMessageToUser(
		@UserId() senderId: number,
		@Param('recipientId', new ParseIntPipe()) recipientId: number,
		@Body(new ValidationPipe({ transform: true })) message: SendMessageDto
	): Promise<MessageDto>
	{
		return await this.messageService.sendMessageToUser(
				message.content, senderId, recipientId);
	}
}