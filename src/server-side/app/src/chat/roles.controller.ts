import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { RoleService, RoleType } from './role.service';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';

@Controller('roles')
export class RolesController {
	constructor(
		private readonly roleService: RoleService,
		private readonly chatSerice: ChatService,
		private readonly userService: UsersService,
		) {}

	@Get('chats/:chatId/:role')
	async getChatRelatives(@Param('chatId') chatId: number, @Param('role') role: RoleType): Promise<User[]> {
		const chat = new Chat();
		chat.id = chatId;
		return await this.roleService.getChatRelatives(role, chat);
	}

	@Get('users/:userId')
	async getUserRoles(@Param('userId') userId: number): Promise<any[]> {
		return await this.roleService.getUserRoles(userId);
	}

	@Post('chats/:chatId/:role')
	async addRelativeToChat(@Param('chatId') chatId: number, @Param('role') role: RoleType, @Body('userId') userId: number): Promise<boolean> {
		const chat = await this.chatSerice.getChat(chatId);
		const user = await this.userService.getUser(userId);
		return await this.roleService.addRelativeToChat(role, chat, user);
	}

	@Post('chats/:chatId/:role/invite')
	async acceptInvite(@Param('chatId') chatId: number, @Param('roleID') roleID: number): Promise<boolean> {
		const chat = await this.chatSerice.getChat(chatId);
		return await this.roleService.editRole(chat, roleID, RoleType.Participant);
	}

	@Delete('chats/:chatId/:role/:userId')
	async removeChatRelative(@Param('chatId') chatId: number, @Param('userId') userId: number): Promise<boolean> {
		const chat = await this.chatSerice.getChat(chatId);
		return await this.roleService.removeChatRelative(chat, userId);
	}

	@Delete('chats/:chatId/:role')
	async removeChatRelatives(@Param('chatId') chatId: number, @Body('userIds') userIds: number[]): Promise<void> {
		const chat = await this.chatSerice.getChat(chatId);
		await this.roleService.removeChatRelatives(chat, userIds);
	}

	@Get('chats/:chatId/:role/:userId')
	async isChatRelative(@Param('chatId') chatId: number, @Param('role') role: RoleType, @Param('userId') userId: number): Promise<boolean> {
		const chat = await this.chatSerice.getChat(chatId);
		return await this.roleService.isChatRelative(chat, userId);
	}
}