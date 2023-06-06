import { Injectable, UseGuards, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { EventsGateway } from '../events/events.gateway';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { CreateChatDto } from './dtos/chat.dtos';
import { RoleService } from './role.service';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Chat)
		private chatRepository: Repository<Chat>,
		// @InjectRepository(Message)
		// private messagesRepository: Repository<Message>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly eventsGateway: EventsGateway,
		private readonly roleService: RoleService
	) {}

	async getAllChats(): Promise<Chat[]> {
		return this.chatRepository.find();
	}

	async getChat(chatId: number): Promise<Chat | null> {
		return this.chatRepository.findOne({
			where: { id: chatId },
			// relations: ['participants', 'owners', 'bannedUsers']
		});
	}

	async getUserChats(userId: number): Promise<Chat[]> {
		const chatParticipants = await this.roleService.getChatParticipantsForUser(userId);
		return chatParticipants.map(participant => participant.chat);
	}

	async getUserGroupChats(userId: number): Promise<Chat[]> {
		const chatParticipants = await this.roleService.getChatParticipantsForUser(userId);
		return chatParticipants.filter(participant => !participant.chat.personal).map(participant => participant.chat);
	}

	async getUserPersonalChats(userId: number): Promise<Chat[]> {
		const chatParticipants = await this.roleService.getChatParticipantsForUser(userId);
		return chatParticipants.filter(participant => participant.chat.personal).map(participant => participant.chat);
	}

	async createChat(createChatDto: CreateChatDto): Promise<Chat> {
		const chat = new Chat();
		chat.name = createChatDto.name;
		chat.private = createChatDto.private;
		chat.password = createChatDto.password;
		chat.ownerID = createChatDto.ownerID;
		chat.owner = await this.userRepository.findOne({where: {id: createChatDto.ownerID}});
		chat.personal = false;

		const savedChat = await this.chatRepository.save(chat);
	
		for (const participantID of createChatDto.participantsID) {
			await this.roleService.addChatParticipant(savedChat, participantID);
		}
	
		return savedChat;
	}

	async deleteChat(chatId: number): Promise<boolean> {
		const chatToDelete = await this.chatRepository.findOne({ where: { id: chatId }, relations: ['participants'] });
		if (!chatToDelete) {
			return false;
		}
		
		for (const participant of chatToDelete.participants) {
			await this.roleService.removeChatParticipant(chatToDelete, participant.user.id);
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


}