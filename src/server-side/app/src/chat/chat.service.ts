import { Injectable, Inject, NotFoundException, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { CreateChatDto, ChatDto, PersonalChatDto, GroupChatDto, UpdateChatDto } from './dtos/chat.dtos';
import { RoleService, RoleType } from './role.service';
import { MessageService } from './message.service';
import { UsersService } from '../users/users.service';
import { ChatEventGateway, RoomEventType } from './chat-event.gateway';
import { UserId } from '../utils/user-id.decorator';
import { SanctionService } from './sanction.service';
import { SanctionType } from './entities/sanction.entity';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Chat)
		private chatRepository: Repository<Chat>,
		@Inject(UsersService)
		private usersService: UsersService,
		@Inject(RoleService)
		private readonly roleService: RoleService,
		@Inject(ChatEventGateway)
		private readonly chatEventGateway: ChatEventGateway,
		@Inject(SanctionService)
		private readonly sanctionService: SanctionService,
	) {}

	async getAllUserChats(userId: number): Promise<ChatDto[]> { // not implemented properly
		const chats = await this.chatRepository.find();
		return this.returnChatDto(chats, userId);
	}

	async getChat(chatId: number): Promise<Chat | null> {
		return this.chatRepository.findOne({where: {id: chatId}});
	}

	async createGroupChat(createChatDto: CreateChatDto): Promise<Chat> {
		if (createChatDto.isPrivate == true && createChatDto.password){
			throw new BadRequestException('Private Chat can not have password');
		}
		const chat = new Chat();
		chat.name = createChatDto.name;
		chat.private = createChatDto.isPrivate;
		if (createChatDto.password) {
			const saltOrRounds = 10;
			const salt = bcrypt.genSaltSync(saltOrRounds);
			chat.password = await bcrypt.hash(createChatDto.password, salt);
			chat.salt = salt;
		} else {
			chat.password = "";
		}
		chat.ownerID = createChatDto.ownerID;
		const owner = await this.usersService.findUser(createChatDto.ownerID);
		if (!owner) {
			throw new NotFoundException('Owner not found');
		}
		chat.owner = owner;
		chat.personal = false;

		const savedChat = await this.chatRepository.save(chat);
		await this.roleService.addRelativeToChat(RoleType.Owner, savedChat, owner);
		
		// send event to all users that are online unless the chat is private then send to participants only
		await this.updateEvent(savedChat, RoomEventType.NewAvailable, await this.makeChatDto(chat, chat.ownerID));
	
		return savedChat;
	}

	async deleteChat(chatId: number, userId: number): Promise<boolean> {
		const chatToDelete = await this.chatRepository.findOne({where: {id: chatId}});
		if (!chatToDelete) {
			return false;
		}

		await this.updateEvent(chatToDelete, RoomEventType.Deleted, await this.makeChatDto(chatToDelete, userId));
		await this.chatRepository.delete(chatId);
		return true;
	}

	async editChat(chatId: number, createChatDto: UpdateChatDto): Promise<Chat> { // change pass
		const chat = await this.chatRepository.findOne({where: {id: chatId}});
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		if (chat.personal || chat.private) {
			throw new ConflictException('Cannot set password on personal or private chats');
		}
		const saltOrRounds = 10;
		const salt = bcrypt.genSaltSync(saltOrRounds);
		chat.password = await bcrypt.hash(createChatDto.password, salt);
		chat.salt = salt;
		return await this.chatRepository.save(chat);
	}

	async getChatMessages(chatId: number): Promise<Message[]> {
		const chat = await this.chatRepository.findOne({where: {id: chatId}, relations: ['messages'] });
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		return chat.messages;
	}

	async createPersonalChat(sender: User, receiverId: number): Promise<Chat> {

		const user2 = await this.usersService.findUser(receiverId);
		if (!user2) {
			throw new NotFoundException('User not found');
		}
		const doesPersonalChatExist = await this.doesPersonalChatExist(sender.id, user2.id);
		if (doesPersonalChatExist) {
			throw new ConflictException('Personal chat already exists');
		}
		const chat = new Chat();
		chat.name = `${sender.name} & ${user2.name}`;
		chat.private = true;
		chat.personal = true;
		chat.ownerID = sender.id;
		chat.owner = sender;
		// chat.password = '';

		const savedChat = await this.chatRepository.save(chat);
		await this.roleService.addRelativeToChat(RoleType.Participant, savedChat, sender);
		await this.roleService.addRelativeToChat(RoleType.Participant, savedChat, user2);
		this.updateEvent(savedChat, RoomEventType.NewAvailable, await this.makeChatDto(savedChat, sender.id));

		return savedChat;
	}

	private async doesPersonalChatExist(senderId: number, recipientId: number): Promise<boolean> {
		const chatExists = await this.chatRepository.createQueryBuilder("chat")
		  .innerJoin("chat.roles", "role")
		  .innerJoin("role.user", "user")
		  .where("chat.personal = :personal", { personal: true })
		  .andWhere("user.id IN (:...userIds)", { userIds: [senderId, recipientId] })
		  .groupBy("chat.id")
		  .having("COUNT(chat.id) = :count", { count: 2 })
		  .getOne();
	  
		return !!chatExists;
	  }

	async findPersonalChatByName(user1ID: number, user2Name: string): Promise<ChatDto | null> {
		
		const user2 = await this.usersService.findOne(user2Name);
		if (!user2) {
			throw new NotFoundException('User not found');
		}
		const chats = await this.chatRepository.find({where: {personal: true}, relations: ['roles']});
		for (const chat of chats) {
			const chatRelatives = await this.roleService.getChatRelatives(chat);
			if (chatRelatives.length === 2 && chatRelatives.some(relative => relative._id === user1ID) &&
					chatRelatives.some(relative => relative._id === user2.id)) {
				return this.makeChatDto(chat, user1ID);
			}
		}
		return null;
	}

	async findPersonalChat(user1: User, user2Id: number): Promise<Chat | null> {

		const user2 = await this.usersService.findUser(user2Id);

		if (!user2) {
			throw new NotFoundException('User not found');
		}
		const chats = await this.chatRepository.find({where: {personal: true}, relations: ['roles']});
		for (const chat of chats) {
			const chatRelatives = await this.roleService.getChatRelatives(chat);
			if (chatRelatives.length === 2 && chatRelatives.some(relative => relative._id === user1.id) &&
					chatRelatives.some(relative => relative._id === user2.id)) {
				return chat;
			}
		}
		return null;
	}

	private async passwordMatches(chat: Chat, password?: string): Promise<boolean> {
		if (!password) {
			return false;
		}
		return await bcrypt.compare(password, chat.password);
	}

	async joinChat(userId: number, chatId: number, password?: string): Promise<boolean>
	{
		const chat = await this.chatRepository.findOne({where: {id: chatId}});
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		if (chat.private) {
			const role = await this.roleService.getRole(chatId, userId);
			if (!role || role.type !== RoleType.Invited) {
				throw new UnauthorizedException('User not an invitee');
			}
			await this.roleService.editRole(role, RoleType.Participant);
		} else {
			const isValid = await this.passwordMatches(chat, password);
			if (!isValid && chat.password.length) {
				throw new UnauthorizedException('Wrong password');
			}
			const user = await this.usersService.findUser(userId);
			const role = await this.roleService.getRole(chatId, userId);
			if (role || !user) {
				throw new BadRequestException('User already a participant');
			}
			await this.roleService.addRelativeToChat(RoleType.Participant, chat, user);
		}
		const chatObject = await this.makeChatDto(chat, userId);
		if (chatObject !== null) {
			this.updateEvent(chat, RoomEventType.Join, chatObject, true);
		}
		return true;
	}

	async leaveChat(userId: number, chatId: number): Promise<boolean> {
		const chat = await this.chatRepository.findOne({where: {id: chatId}});
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		const role = await this.roleService.getRole(chatId, userId);
		if (!role) {
			throw new BadRequestException('User not a participant');
		}
		if (chat.ownerID == userId || chat.personal) {
			await this.deleteChat(chat.id, userId);
		} else {
			await this.roleService.removeChatRelative(chat, userId);
			this.updateEvent(chat, RoomEventType.Leave, await this.makeChatDto(chat, userId), true); // reloads participants
		}
		return true;
	}

	async kickFromChat(
		userId: number,
		chatId: number,
		kickedId: number,
		duration?: number,
	): Promise<boolean> {
		const chat = await this.chatRepository.findOne({where: {id: chatId}});
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		if (kickedId === userId){
			throw new BadRequestException('Can not Kick yourself from Chat');
		}
		const roleofExecutor = await this.roleService.getRole(chatId, userId);
		const roleofMutee = await this.roleService.getRole(chatId, kickedId);
		if (roleofExecutor?.type === RoleType.Admin){
			if (roleofMutee?.type === RoleType.Admin || roleofMutee?.type === RoleType.Owner){
				throw new BadRequestException('Can not kick other Admins or owners from Chat');
			}
		}
		this.updateEvent(chat, RoomEventType.Kicked, await this.makeChatDto(chat, userId, kickedId), true); // ashame to all Online users
		if (duration) {
			this.sanctionService.imposeSanction(kickedId, chatId, duration);
		}
		const role = await this.roleService.removeChatRelative(chat, kickedId);
		return true;
	}

	async inviteToChat(
		userId: number,
		chatId: number,
		userName: string,
	): Promise<boolean> {
		const chat = await this.getChat(chatId);
		if (!chat) {
			throw new NotFoundException('Chat not found');
		} else if (!chat.private) {
			throw new BadRequestException('Can not invite to non-private chat');
		}
		const user = await this.usersService.findOne(userName);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		const role = await this.roleService.getRole(chatId, user.id);
		if (role) {
			throw new BadRequestException('User already a participant');
		}
		const status = await this.roleService.addRelativeToChat(RoleType.Invited, chat, user);
		this.updateEvent(chat, RoomEventType.Invite, await this.makeChatDto(chat, userId, user.id));
		return status;
	}

	async promoteUser(
		userId: number,
		chatId: number,
		promoteeName: string,
	): Promise<boolean> {
		const chat = await this.getChat(chatId);
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		const promotee = await this.usersService.findOne(promoteeName);
		if (!promotee) {
			throw new NotFoundException('User not found');
		}
		const role = await this.roleService.getRole(chatId, promotee.id);
		if (!role) {
			throw new BadRequestException('User not a participant');
		}
		if (promotee.id === userId){
			throw new BadRequestException('Can not Promote yourself');
		}
		if (role.type === RoleType.Admin || role.type === RoleType.Owner) {
			throw new BadRequestException('User already an admin');
		}
		await this.roleService.editRole(role, RoleType.Admin);
		this.updateEvent(chat, RoomEventType.Promoted, await this.makeChatDto(chat, userId, promotee.id));
		return true;
	}

	async demoteUser(
		userId: number,
		chatId: number,
		demoteeName: string,
	): Promise<boolean> {
		const chat = await this.getChat(chatId);
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		const demotee = await this.usersService.findOne(demoteeName);
		if (!demotee) {
			throw new NotFoundException('User not found');
		}
		const role = await this.roleService.getRole(chatId, demotee.id);
		if (!role) {
			throw new BadRequestException('User not a participant');
		}
		if (role.type === RoleType.Participant) {
			throw new BadRequestException('User not an admin');
		}
		if (userId === demotee.id){
			throw new BadRequestException('Can not demote yourself');
		}
		const roleofExecutor = await this.roleService.getRole(chatId, userId);
		if (roleofExecutor?.type === RoleType.Admin){
			if (role?.type === RoleType.Admin || role?.type === RoleType.Owner){
				throw new BadRequestException('Can not demote other Admins or owners');
			}
		}
		await this.roleService.editRole(role, RoleType.Participant);
		this.updateEvent(chat, RoomEventType.Demoted, await this.makeChatDto(chat, userId, demotee.id));
		return true;
	}

	async banUser(
		userId: number,
		chatId: number,
		banneeName: string,
	): Promise<boolean> {
		const chat = await this.getChat(chatId);
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		const banned = await this.usersService.findOne(banneeName);
		if (!banned) {
			throw new NotFoundException('User not found');
		}
		if (banned.id === userId){
			throw new BadRequestException('Can not ban yourself')
		}
		const role = await this.roleService.getRole(chatId, banned.id);
		if (!role) {
			throw new BadRequestException('User not a participant');
		}
		if (role.type === RoleType.Blocked) {
			throw new BadRequestException('User already banned');
		}
		if (role.type === RoleType.Owner) {
			throw new BadRequestException('User is an Owner');
		}
		await this.roleService.editRole(role, RoleType.Blocked);
		this.updateEvent(chat, RoomEventType.Banned, await this.makeChatDto(chat, userId, banned.id), true); // ashame to all Online users
		// this.updateEvent(chat, RoomEventType.Kicked, await this.makeChatDto(chat, userId, kickedId), true); // ashame to all Online users

		return true;
	}

	async unbanUser(
		userId: number,
		chatId: number,
		unbannedName: string,
	): Promise<boolean> {
		const chat = await this.getChat(chatId);
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		const unbanned = await this.usersService.findOne(unbannedName);
		if (!unbanned) {
			throw new NotFoundException('User not found');
		}
		const role = await this.roleService.getRole(chatId, unbanned.id);
		if (!role) {
			throw new BadRequestException('User not a participant');
		}
		if (role.type !== RoleType.Blocked) {
			throw new BadRequestException('User not banned');
		}
		await this.roleService.editRole(role, RoleType.Participant);
		this.updateEvent(chat, RoomEventType.Unbanned, await this.makeChatDto(chat, userId, unbanned.id));
		return true;
	}

	async muteUser(
		userId: number,
		chatId: number,
		mutedName: string,
		duration: number = 3600 // 1 hour,
	): Promise<boolean> {
		const chat = await this.getChat(chatId);
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		const muted = await this.usersService.findOne(mutedName);
		if (!muted) {
			throw new NotFoundException('User not found');
		}
		if (muted.id === userId)
			throw new BadRequestException('Can not mute yourself')
		const roleofExecutor = await this.roleService.getRole(chatId, userId);
		const roleofMutee = await this.roleService.getRole(chatId, muted.id);
		if (roleofExecutor?.type === RoleType.Admin){
			if (roleofMutee?.type === RoleType.Admin || roleofMutee?.type === RoleType.Owner){
				throw new BadRequestException('Can not mute other Admins or owners');
			}
		}
		await this.sanctionService.imposeSanction(muted.id, chatId, duration, SanctionType.MUTED);
		this.updateEvent(chat, RoomEventType.Muted, await this.makeChatDto(chat, userId, muted.id));
		return true;
	}

	async unmuteUser(
		userId: number,
		chatId: number,
		unmutedName: string,
	): Promise<boolean> {
		const chat = await this.getChat(chatId);
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		const unmuted = await this.usersService.findOne(unmutedName);
		if (!unmuted) {
			throw new NotFoundException('User not found');
		}
		await this.sanctionService.removeSanction(unmuted.id, chatId);
		this.updateEvent(chat, RoomEventType.Unmuted, await this.makeChatDto(chat, userId, unmuted.id));
		return true;
	}

	private async returnChatDto(chat: Chat[], userId: number): Promise<ChatDto[]> {
		const chatDtos = await Promise.all(chat.map(async (chat) => {
			return await this.makeChatDto(chat, userId);
		}));
	
		const chats: ChatDto[] = chatDtos.filter(chatDto => chatDto !== null);
		return chats ? chats : [];
	}

	private async makeChatDto(chat: Chat, userId: number, kickedId?: number): Promise<ChatDto | null> {
		const participants = await this.roleService.getChatRelatives(chat);
		const isParticipant = await this.roleService.isParticipant(userId, chat.id);
		const role = await this.roleService.getRole(chat.id, userId);
	
		if (!chat.personal) {
			if (chat.private && !isParticipant) {
				return null;
			}
			const owner = await this.usersService.getUserInfo(chat.ownerID);
			const isOwner = chat.ownerID === userId;
			const groupChatDto = new GroupChatDto({
					chat: chat,
					owner: owner,
					privileged: isOwner,
					mine: isOwner,
					amParticipant: (isParticipant && role?.type !== RoleType.Invited)? true : false,
					participants: participants,
					kickedId: kickedId,
					pritvate: chat.private,
				});
			return groupChatDto;
		} else {
			if (!isParticipant) return null;
			console.log('personal chat')
			const isBlocked = await this.usersService.isBlocked(participants[0]._id, participants[1]._id);
			if (isBlocked) return null;
			const personalChatDto = new PersonalChatDto(chat, participants[0]);
			console.log(personalChatDto);
			return personalChatDto;
		}
	}


	private async updateEvent(chat: Chat, eventType: RoomEventType, chatObject?: any, participantsExclusive: boolean = false, saveEvent: boolean = false): Promise<void> {
		if (!participantsExclusive && (!chat.private && !chat.personal)) {
			await this.chatEventGateway.updateOnlineUsersChatEvent(chat, eventType, chatObject);
		}
		else {
			await this.chatEventGateway.updateParticipantsOfRoomEvent(chat, eventType, saveEvent, chatObject);
		}
	}
}