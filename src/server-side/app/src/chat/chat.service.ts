import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { EventsGateway } from '../events/events.gateway';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { CreateChatDto } from './dtos/chat.dtos';
import { RoleService, RoleType } from './role.service';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Chat)
		private chatRepository: Repository<Chat>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly eventsGateway: EventsGateway,
		private readonly roleService: RoleService
	) {}

	async getAllChats(): Promise<Chat[]> {
		return this.chatRepository.find();
	}

	async getChat(chatId: number): Promise<Chat | null> {
		return this.chatRepository.findOne({where: {id: chatId}});
	}

	async getUserChats(userId: number): Promise<Chat[]> {
		const userRoles = await this.roleService.getUserRoles(userId);
		return userRoles.map(role => role.chat);
	}

	async createGroupChat(createChatDto: CreateChatDto): Promise<Chat> {
		const chat = new Chat();
		chat.name = createChatDto.name;
		chat.private = createChatDto.private;
		chat.password = createChatDto.password;
		chat.ownerID = createChatDto.ownerID;
		const owner = await this.userRepository.findOne({where: {id: createChatDto.ownerID}});
		if (!owner) {
			throw new NotFoundException('Owner not found');
		}
		chat.owner = owner;
		chat.personal = false;

		const savedChat = await this.chatRepository.save(chat);
		await this.roleService.addRelativeToChat(RoleType.Participant, savedChat, owner);
	
		return savedChat;
	}

	async deleteChat(chatId: number): Promise<boolean> {
		const chatToDelete = await this.chatRepository.findOne({where: {id: chatId}});
		if (!chatToDelete) {
			return false;
		}

		// Remove all related roles to this chat before deleting the chat
		const chatRelatives = await this.roleService.getChatRelatives(RoleType.Participant, chatToDelete);
		for (const relative of chatRelatives) {
			await this.roleService.removeChatRelative(chatToDelete, relative.id);
		}

		await this.chatRepository.delete(chatId);
		
		return true;
	}

	async getChatMessages(chatId: number): Promise<Message[]> {
		const chat = await this.chatRepository.findOne({where: {id: chatId}, relations: ['messages'] });
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		return chat.messages;
	}

	async createPersonalChat(user1: User, user2: User): Promise<Chat> {

		if (!user1 || !user2) {
			throw new NotFoundException('User not found');
		}

		const chat = new Chat();
		chat.name = `${user1.name} & ${user2.name}`;
		chat.private = true;
		chat.personal = true;
		chat.ownerID = user1.id;
		chat.owner = user1;
		// chat.password = '';

		const savedChat = await this.chatRepository.save(chat);
		await this.roleService.addRelativeToChat(RoleType.Participant, savedChat, user1);
		await this.roleService.addRelativeToChat(RoleType.Participant, savedChat, user2);

		return savedChat;
	}

	async findPersonalChat(user1: User, user2: User): Promise<Chat | null> {
		const chats = await this.chatRepository.find({where: {personal: true}, relations: ['roles']});
		for (const chat of chats) {
			const chatRelatives = await this.roleService.getChatRelatives(RoleType.Participant, chat);
			if (chatRelatives.length === 2 && chatRelatives.some(relative => relative.id === user1.id) && chatRelatives.some(relative => relative.id === user2.id)) {
				return chat;
			}
		}
		return null;
	}
}