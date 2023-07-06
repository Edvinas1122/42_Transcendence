import { Injectable, Inject, NotFoundException, BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { RoleService } from './role.service';
import { UsersService } from '../users/users.service';
import { ChatEventGateway, MessageEventType } from './chat-event.gateway';
import { Chat } from './entities/chat.entity';
import { UserInfo } from '../users/dtos/user.dto';
import { MessageDto } from './dtos/message.dtos';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private messagesRepository: Repository<Message>,
		@Inject(UsersService)
		private usersService: UsersService,
		@Inject(ChatService)
		private chatService: ChatService,
		@Inject(ChatEventGateway)
		private readonly chatEventGateway: ChatEventGateway,
	) {}

	async getChatMessages(
		chatId: number,
		userId: number,
	): Promise<MessageDto[]> {
		const chat = await this.chatService.getChat(chatId);
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		const messages = await this.messagesRepository.find({where: { chatID: chat.id }, relations: ['sender']});
	
		// Map over the messages and for each one return a promise
		const promises = messages.map(async message => {
			const isBlocked = await this.usersService.isBlocked(userId, message.sender.id);
			if(!isBlocked){
				return new MessageDto(message, userId, message.sender);
			}
		});
		
		// Use Promise.all to resolve all promises in parallel
		const messageDtos = await Promise.all(promises);
	
		// Filter out any undefined values
		const messageDtosFiltered = messageDtos.filter(message => message !== undefined);

		// Reverse the order of the array
		return [...messageDtosFiltered].reverse();
	}

	async sendMessageToChat(
		content: string,
		senderId: number,
		// password: string,
		chatId: number
	): Promise<MessageDto> {
		const chat = await this.chatService.getChat(chatId);
		const sender = await this.usersService.findUser(senderId);

		if (!chat || !sender) {
			throw new NotFoundException('Chat or sender not found');
		}
		const message = await this.messagesRepository.save({content: content, sender: sender, chat: chat});
		const returnedMessage: MessageDto = new MessageDto(message, senderId, sender);
		await this.updateEvent(chat, MessageEventType.New, returnedMessage);
		return returnedMessage;
	}

	async sendMessageToUser(
		content: string,
		senderId: number,
		recipientId: number
	): Promise<MessageDto> {
	
		const sender = await this.usersService.findUser(senderId);
		
		if (!sender) {
			throw new NotFoundException('Sender not found');
		}
		if (senderId === recipientId){
			throw new BadRequestException('Can not create MSG Priv with yourself');
		}
		let chat = await this.chatService.findPersonalChat(sender, recipientId);
		if (!chat) {
			chat = await this.chatService.createPersonalChat(sender, recipientId);
		}
	
		// Now we have a chat, either found or newly created, so we can send the message
		const message = await this.messagesRepository.save({content: content, sender: sender, chat: chat});
		const returnedMessage: MessageDto = new MessageDto(message, senderId, sender);
		await this.updateEvent(chat, MessageEventType.New, returnedMessage);
		return returnedMessage;
	}

	public async updateEvent(
		chat: Chat,
		eventType: MessageEventType = MessageEventType.New,
		message?: MessageDto
	) {
		// if (chat.personal || chat.private ) {
		// if (true ) {
		await this.chatEventGateway.updateParticipantsOfMessageEvent(chat, message, eventType); // who else needs to know? ha ha
		// }
		// else {
		// 	await this.chatEventGateway.updateOnlineUsersMessageEvent(chat, message, eventType);
		// }
	}
}

export { MessageDto };