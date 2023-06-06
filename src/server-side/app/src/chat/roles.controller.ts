import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { RoleService } from './role.service';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';

@Controller('roles')
export class RolesController {
	constructor(private readonly roleService: RoleService) {}

	@Get('chats/:chatId/participants')
	async getChatParticipants(@Param('chatId') chatId: number): Promise<User[]> {
		const chat = new Chat();
		chat.id = chatId;
		return await this.roleService.getChatParticipants(chat);
	}

	@Get('users/:userId/participants')
	async getChatParticipantsForUser(@Param('userId') userId: number): Promise<Chat[]> {
		const participants = await this.roleService.getChatParticipantsForUser(userId);
		return participants.map(participant => participant.chat);
	}

	// @Post('chats/participants')
	@Post('chats/:chatId/participants')
	async addChatParticipant(@Param('chatId') chatId: number, @Body() body): Promise<boolean> {
		const chat = new Chat();
		chat.id = chatId;
		return await this.roleService.addChatParticipant(chat, body.userId);
	}

	@Delete('chats/:chatId/participants/:userId')
	async removeChatParticipant(@Param('chatId') chatId: number, @Param('userId') userId: number): Promise<void> {
		const chat = new Chat();
		chat.id = chatId;
		await this.roleService.removeChatParticipant(chat, userId);
	}

	@Delete('chats/:chatId/participants')
	async removeChatParticipants(@Param('chatId') chatId: number, @Body() body): Promise<void> {
		const chat = new Chat();
		chat.id = chatId;
		await this.roleService.removeChatParticipants(chat, body.userIds);
	}
}