import { Controller, Get, Req, Post, Delete, Param, Body, Patch, UseGuards, Inject, ParseIntPipe, ValidationPipe, ParseEnumPipe, BadRequestException } from '@nestjs/common';
import { RoleService, RoleType, AcceptedRoleType } from './role.service';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service'
import { UserInfo } from '../users/dtos/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateChatDto, ChatIdDto, ChatDto, UpdateChatDto, JoinChatDto, EditRoleDto } from './dtos/chat.dtos'; // import DTOs
import { PrivilegedGuard } from './guards/privileged.guard';
import { UserId } from '../utils/user-id.decorator';
import { NoSanctionGuard } from './guards/noSanction.guard';
import { SanctionService } from './sanction.service';
import { UserNameParam} from './dtos/roles.dtos';


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
	async getChatRelatives(
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Param('role', new ParseEnumPipe(RoleType)) role: RoleType
	): Promise<UserInfo[]>
	{
		const chat = new Chat();
		chat.id = chatId;
		if (role === RoleType.Any) {
			return await this.roleService.getChatRelatives(chat);
		}
		return await this.roleService.getChatRoleRelatives(chat, role);
	}

	@UseGuards(NoSanctionGuard)
	@Post(':chatId/join')
	async joinChat(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId,
		@Body(new ValidationPipe({ transform: true })) body: JoinChatDto
	): Promise<boolean>
	{
		const chatDto = await this.chatService.joinChat(UserId, chatId, body.password);
		return chatDto;
	}

	@Post(':chatId/leave')
	async leaveChat(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId,
	): Promise<boolean>
	{
		return await this.chatService.leaveChat(UserId, chatId);
	}

	@UseGuards(PrivilegedGuard)
	@Post(':chatId/invite/')
	async inviteUser(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId,
		@Body(new ValidationPipe()) input: UserNameParam, // validation pipe
	): Promise<any>
	{
		await this.chatService.inviteToChat(UserId, chatId, input.user);
		return { success: true, message: 'User invited' };
	}

	@UseGuards(PrivilegedGuard)  // KICK USER
	@Delete(':chatId/:userId')
	async removeChatRelative(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Param('userId', new ParseIntPipe()) userId: number,
		@Body('duration', new ParseIntPipe()) duration: number = 0,
	): Promise<boolean>
	{
		return await this.chatService.kickFromChat(UserId, chatId, userId, duration);
	}

	@UseGuards(PrivilegedGuard)
	@Post(':chatId/promote')
	async promoteUser(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Body('user') userName: string, // validation pipe
	): Promise<boolean>
	{
		return await this.chatService.promoteUser(UserId, chatId, userName);
	}

	@UseGuards(PrivilegedGuard)
	@Post(':chatId/demote')
	async demoteUser(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Body('user') userName: string, // validation pipe
	): Promise<boolean>
	{
		return await this.chatService.demoteUser(UserId, chatId, userName);
	}

	@UseGuards(PrivilegedGuard)
	@Post(':chatId/ban')
	async banUser(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Body('user') userName: string, // validation pipe
	): Promise<boolean>
	{
		return await this.chatService.banUser(UserId, chatId, userName);
	}

	@UseGuards(PrivilegedGuard)
	@Post(':chatId/unban')
	async unbanUser(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Body('user') userName: string, // validation pipe
	): Promise<boolean>
	{
		return await this.chatService.unbanUser(UserId, chatId, userName);
	}

	@UseGuards(PrivilegedGuard)
	@Post(':chatId/mute')
	async muteUser(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Body('user') userName: string, // validation pipe
	): Promise<boolean>
	{
		console.log('muteUser triggered', "userName", userName);
		return await this.chatService.muteUser(UserId, chatId, userName);
	}

	@UseGuards(PrivilegedGuard)
	@Post(':chatId/unmute')
	async unmuteUser(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Body('user') userName: string, // validation pipe
	): Promise<boolean>
	{
		return await this.chatService.unmuteUser(UserId, chatId, userName);
	}



	// @UseGuards(PrivilegedGuard)
	// @Patch('chats/:chatId/:userId')
	// async editRole(
	// 	@Param('chatId', new ParseIntPipe()) chatId: number,
	// 	@Param('userId', new ParseIntPipe()) userId: number,
	// 	@Body('newRole', new ValidationPipe()) info: EditRoleDto
	// ): Promise<boolean>
	// {
	// 	const chat = await this.chatService.getChat(chatId);
	// 	const user = await this.userService.getUser(userId);
	// 	const roleObj = await this.roleService.getRole(chat.id, user.id);
	// 	return await this.roleService.editRole(roleObj, info.newRole);
	// }
}
