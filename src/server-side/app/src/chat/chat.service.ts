import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { CreateChatDto, ChatDto, PersonalChatDto, GroupChatDto } from './dtos/chat.dtos';
import { RoleService, RoleType } from './role.service';
import { MessageService } from './message.service';
import { UsersService } from '../users/users.service';
import { ChatEventGateway, RoomEventType } from './chat-event.gateway';

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

	async getAllChats(): Promise<Chat[]> {
		return this.chatRepository.find();
	}

	async getChat(chatId: number): Promise<Chat | null> {
		return this.chatRepository.findOne({where: {id: chatId}});
	}

	async getUserChats(userId: number): Promise<ChatDto[]> {
		const userRoles = await this.roleService.getAvailableUserRoles(userId);
		const chats = userRoles.map(role => role.chat);
	
		// mapping each chat to a Promise of ChatDto
		const chatDtoPromises = chats.map(async (chat) => {
			const owner = await this.usersService.getUserInfo(chat.ownerID);
			let participants;
			if (!chat.password || chat.password === '') {
				participants = await this.roleService.getChatRelatives(chat);
				// const messages = await this.messageService.getChatMessages(chat);
			}
			else {
				participants = [];
				// const messages = [];
			}
			if (!chat.personal) {
				const groupChatDto = new GroupChatDto(chat, owner, participants);
				// populate the GroupChatDto instance with data from the chat entity
				groupChatDto.privileged = await this.roleService.isPrivileged(userId, chat.id);
				return groupChatDto;
			} else {
				const personalChatDto = new PersonalChatDto(chat, participants[0]);
				// populate the PersonalChatDto instance with data from the chat entity
				return personalChatDto;
			}
		});
	
		// waiting for all Promises of ChatDto to resolve
		const chatDtos = await Promise.all(chatDtoPromises);
	
		return chatDtos;
	}

	async createGroupChat(createChatDto: CreateChatDto): Promise<Chat> {
		const chat = new Chat();
		chat.name = createChatDto.name;
		chat.private = createChatDto.private;
		chat.password = createChatDto.password;
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
		await this.updateEvent(savedChat, RoomEventType.NewAvailable);
	
		return savedChat;
	}

	async deleteChat(chatId: number): Promise<boolean> {
		const chatToDelete = await this.chatRepository.findOne({where: {id: chatId}});
		if (!chatToDelete) {
			return false;
		}

		// Remove all related roles to this chat before deleting the chat
		const chatRelatives = await this.roleService.getChatRelatives(chatToDelete);
		for (const relative of chatRelatives) {
			// await this.chatEventGateway.sendEventToChat(chatToDelete, EventType.CHAT_ROOM_DELETED);
			await this.roleService.removeChatRelative(chatToDelete, relative._id);
		}

		await this.chatRepository.delete(chatId);

		await this.updateEvent(chatToDelete, RoomEventType.Deleted);
		
		return true;
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
		const role = await this.roleService.getRole(chatId, userId);
		if (role.type !== RoleType.Invited) {
			throw new BadRequestException('User not an invitee');
		}
		await this.roleService.editRole(role, RoleType.Participant);
		return true;
	}

	private async updateEvent(chat: Chat, eventType: RoomEventType): Promise<void> {
		if (!chat.private) {
			await this.chatEventGateway.updateOnlineUsersChatEvent(chat, eventType);
		}
		else {
			await this.chatEventGateway.updateParticipantsOfRoomEvent(chat, eventType);
		}
	}

}