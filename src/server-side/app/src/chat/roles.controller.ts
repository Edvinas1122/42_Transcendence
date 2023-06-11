import { Controller, Get, Req, Post, Delete, Param, Body, Patch, UseGuards, Inject } from '@nestjs/common';
import { RoleService, RoleType, AcceptedRoleType } from './role.service';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service'
import { UserInfo } from '../users/dtos/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateChatDto, ChatIdDto, ChatDto, UpdateChatDto, JoinChatDto } from './dtos/chat.dtos'; // import DTOs
import { PrivilegedGuard } from './guards/owner.guard';


@UseGuards(JwtAuthGuard)
@Controller('chat/roles')
export class RolesController {
	constructor(
		@Inject(RoleService)
		private readonly roleService: RoleService,
		@Inject(ChatService)
		private readonly chatService: ChatService,
		@Inject(UsersService)
		private readonly userService: UsersService,
		) {}

	@Get(':chatId/:role')
	async getChatRelatives(@Param('chatId') chatId: number, @Param('role') role: RoleType): Promise<UserInfo[]> {
		const chat = new Chat();
		chat.id = chatId;
		if (role === RoleType.Any) {
			return await this.roleService.getChatRelatives(chat);
		}
		return await this.roleService.getChatRoleRelatives(role, chat);
	}

	// @Get('users/:userId')
	// async getUserRoles(@Param('userId') userId: number): Promise<any[]> {
	// 	return await this.roleService.getUserRoles(userId);
	// }

	// @Post('chats/:chatId/:role')
	// async addRelativeToChat(@Param('chatId') chatId: number, @Param('role') role: RoleType, @Body('userId') userId: number): Promise<boolean> {
	// 	const chat = await this.chatSerice.getChat(chatId);
	// 	const user = await this.userService.getUser(userId);
	// 	return await this.roleService.addRelativeToChat(role, chat, user);
	// }

	@Post(':chatId/join')
	async joinChat(@Req() req: Request, @Param() chatId, @Body() body: JoinChatDto): Promise<boolean> {
		const UserId = req['user']['id'];
		const chatDto = await this.chatService.joinChat(UserId, chatId, body.chatPassword);
		// this.eventService.emit('chat', chatDto);
		return chatDto;
	}

	@UseGuards(PrivilegedGuard)
	@Delete(':chatId/:userId')
	async removeChatRelative(@Param('chatId') chatId: number, @Param('userId') userId: number): Promise<boolean> {
		const chat = await this.chatService.getChat(chatId);
		return await this.roleService.removeChatRelative(chat, userId);
	}

	@UseGuards(PrivilegedGuard)
	@Delete(':chatId/')
	async removeChatRelatives(@Param('chatId') chatId: number, @Body('userIds') userIds: number[]): Promise<void> {
		const chat = await this.chatService.getChat(chatId);
		await this.roleService.removeChatRelatives(chat, userIds);
	}

	// @Get('chats/:chatId/:role/:userId')
	// async isChatRelative(@Param('chatId') chatId: number, @Param('role') role: RoleType, @Param('userId') userId: number): Promise<boolean> {
	// 	const chat = await this.chatService.getChat(chatId);
	// 	return await this.roleService.isChatRelative(chat, userId);
	// }

	@UseGuards(PrivilegedGuard)
	@Patch('chats/:chatId/:role/:userId')
	async editRole(@Param('chatId') chatId: number, @Param('role') role: RoleType, @Param('userId') userId: number, @Body('newRole') newRole: RoleType): Promise<boolean> {
		const chat = await this.chatService.getChat(chatId);
		const user = await this.userService.getUser(userId);
		const roleObj = await this.roleService.getRole(chat.id, user.id);
		return await this.roleService.editRole(roleObj, newRole);
	}
}