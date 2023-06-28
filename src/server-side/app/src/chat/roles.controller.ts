import { Controller, Get, Req, Post, Delete, Param, Body, Patch, UseGuards, Inject, ParseIntPipe, ValidationPipe, ParseEnumPipe } from '@nestjs/common';
import { RoleService, RoleType, AcceptedRoleType } from './role.service';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service'
import { UserInfo } from '../users/dtos/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateChatDto, ChatIdDto, ChatDto, UpdateChatDto, JoinChatDto, EditRoleDto } from './dtos/chat.dtos'; // import DTOs
import { PrivilegedGuard } from './guards/owner.guard';
import { UserId } from '../utils/user-id.decorator';


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

	@Post(':chatId/join')
	async joinChat(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId,
		@Body(new ValidationPipe({ transform: true })) body: JoinChatDto
	): Promise<boolean>
	{
		console.log('joinChat triggered');
		const chatDto = await this.chatService.joinChat(UserId, chatId, body.chatPassword);
		return chatDto;
	}

	@Post(':chatId/leave')
	async leaveChat(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId,
	): Promise<boolean>
	{
		const chat = await this.chatService.getChat(chatId);
		let status: boolean;
		console.log('leaveChat triggered', chat);
		if (chat?.ownerID == UserId) {
			status = await this.chatService.deleteChat(chat.id);
		} else {
			status = await this.roleService.removeChatRelative(chatId, UserId);
		return status;
		}
	}

	@Post(':chatId/invite/:userId')
	async inviteUser(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId,
		@Param('userId', new ParseIntPipe()) userId,
	): Promise<boolean>
	{
		const chat = await this.chatService.getChat(chatId);
		const user = await this.userService.getUser(userId);
		return await this.roleService.addRelativeToChat(RoleType.Invited, chat, user);
	}

	@Post(':chatId/invite/accept')
	async acceptInvite(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId,
	): Promise<boolean>
	{
		const chat = await this.chatService.getChat(chatId);
		const user = await this.userService.getUser(UserId);
		return await this.roleService.addRelativeToChat(RoleType.Participant, chat, user);
	}

	@Post(':chatId/invite/decline')
	async declineInvite(
		@UserId() UserId: number,
		@Param('chatId', new ParseIntPipe()) chatId,
	): Promise<boolean>
	{
		const chat = await this.chatService.getChat(chatId);
		return await this.roleService.removeChatRelative(chat, UserId);
	}

	@UseGuards(PrivilegedGuard)
	@Delete(':chatId/:userId')
	async removeChatRelative(
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Param('userId', new ParseIntPipe()) userId: number
	): Promise<boolean>
	{
		const chat = await this.chatService.getChat(chatId);
		return await this.roleService.removeChatRelative(chat, userId);
	}

	@UseGuards(PrivilegedGuard)
	@Delete(':chatId/')
	async removeChatRelatives(
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Body('userIds') userIds: number[]
	): Promise<void>
	{
		const chat = await this.chatService.getChat(chatId);
		await this.roleService.removeChatRelatives(chat, userIds);
	}

	@UseGuards(PrivilegedGuard)
	@Patch('chats/:chatId/:userId')
	async editRole(
		@Param('chatId', new ParseIntPipe()) chatId: number,
		@Param('userId', new ParseIntPipe()) userId: number,
		@Body('newRole', new ValidationPipe()) info: EditRoleDto
	): Promise<boolean>
	{
		const chat = await this.chatService.getChat(chatId);
		const user = await this.userService.getUser(userId);
		const roleObj = await this.roleService.getRole(chat.id, user.id);
		return await this.roleService.editRole(roleObj, info.newRole);
	}
}
