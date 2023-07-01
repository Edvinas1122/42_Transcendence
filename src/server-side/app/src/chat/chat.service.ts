import { Injectable, Inject, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
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
	) {}

	async getAllUserChats(userId: number): Promise<ChatDto[]> { // not implemented properly
		const chats = await this.chatRepository.find();
		return this.returnChatDto(chats, userId);
	}

	async getChat(chatId: number): Promise<Chat | null> {
		return this.chatRepository.findOne({where: {id: chatId}});
	}

	async createGroupChat(createChatDto: CreateChatDto): Promise<Chat> {
		const chat = new Chat();
		chat.name = createChatDto.name;
		chat.private = createChatDto.isPrivate;
		chat.password = createChatDto.password ? createChatDto.password : "";
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

	async deleteChat(chatId: number): Promise<boolean> {
		const chatToDelete = await this.chatRepository.findOne({where: {id: chatId}});
		if (!chatToDelete) {
			return false;
		}

		await this.updateEvent(chatToDelete, RoomEventType.Deleted);
		await this.chatRepository.delete(chatId);
		return true;
	}

	async editChat(chatId: number, createChatDto: UpdateChatDto): Promise<Chat> {
		const chat = await this.chatRepository.findOne({where: {id: chatId}});
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		// chat.name = createChatDto.name;
		// chat.private = createChatDto.isPrivate;
		chat.password = createChatDto.password ? createChatDto.password : "";
		// chat.ownerID = createChatDto.ownerID;
		console.log(chat);
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

		return savedChat;
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

	async joinChat(userId: number, chatId: number, password?: string): Promise<boolean>
	{
		const chat = await this.chatRepository.findOne({where: {id: chatId}});
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		if (chat.private) {
			const role = await this.roleService.getRole(chatId, userId);
			if (role.type !== RoleType.Invited) {
				throw new BadRequestException('User not an invitee');
			}
			await this.roleService.editRole(role, RoleType.Participant);
		} else {
			console.log("Validating password", "chat.password", chat.password, "password", password);
			if (chat.password !== "" && chat.password !== password) {
				throw new UnauthorizedException('Wrong password');
			}
			const user = await this.usersService.findUser(userId);
			const role = await this.roleService.getRole(chatId, userId);
			if (role) {
				throw new BadRequestException('User already a participant');
			}
			await this.roleService.addRelativeToChat(RoleType.Participant, chat, user);
		}
		this.updateEvent(chat, RoomEventType.Join, await this.makeChatDto(chat, userId), true);
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
		if (chat.ownerID == userId) {
			await this.deleteChat(chat.id);
		} else {
			await this.roleService.removeChatRelative(chat, userId);
			this.updateEvent(chat, RoomEventType.Leave, await this.makeChatDto(chat, userId), true); // reloads participants
		}
		return true;
	}

	async kickFromChat(userId: number, chatId: number, kickedId: number): Promise<boolean> {
		const chat = await this.chatRepository.findOne({where: {id: chatId}});
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		this.updateEvent(chat, RoomEventType.Kicked, await this.makeChatDto(chat, userId), true); // ashame to all Online users
		const role = await this.roleService.removeChatRelative(chat, kickedId);
		return true;
	}

	private async returnChatDto(chat: Chat[], userId: number): Promise<ChatDto[]> {
		return Promise.all(chat.map(async (chat) => {
			return await this.makeChatDto(chat, userId);
		}));
	}

	private async makeChatDto(chat: Chat, userId: number): Promise<ChatDto> {
		const participants = await this.roleService.getChatRelatives(chat);
		const isParticipant = await this.roleService.isParticipant(userId, chat.id);

		if (!chat.personal) {
			const owner = await this.usersService.getUserInfo(chat.ownerID);
			const isOwner = chat.ownerID === userId;
			const groupChatDto = new GroupChatDto({
					chat: chat,
					owner: owner,
					privileged: isOwner,
					mine: isOwner,
					amParticipant: isParticipant,
					participants: participants,
				});
			return groupChatDto;
		} else {
			const personalChatDto = new PersonalChatDto(chat, participants[0]);
			return personalChatDto;
		}
	}

	private async updateEvent(chat: Chat, eventType: RoomEventType, chatObject?: any, participantsExclusive: boolean = false, saveEvent: boolean = false): Promise<void> {
		if (!participantsExclusive && !chat.private && !chat.personal) {
			await this.chatEventGateway.updateOnlineUsersChatEvent(chat, eventType, chatObject);
		}
		else {
			await this.chatEventGateway.updateParticipantsOfRoomEvent(chat, eventType, saveEvent, chatObject);
		}
	}
}