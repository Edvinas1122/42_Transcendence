import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';


@Injectable()
export class MessageService {
	constructor(
		// @InjectRepository(Chat)
		// private chatRepository: Repository<Chat>,
		@InjectRepository(Message)
		private messagesRepository: Repository<Message>,
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private chatService: ChatService,
	) {}

	async getChatMessages(chatId: number): Promise<Message[]> {
		console.log('getChatMessages');
		const chat = await this.chatService.getChat(chatId);
		console.log(chat);
		if (!chat) {
			throw new NotFoundException('Chat not found');
		}
		console.log('returning messages');
		const messages = await this.messagesRepository.find({where: { chat: chat }});
		console.log(messages);
		return await this.messagesRepository.find({where: { chatID: chatId }});
	}

	async sendMessageToChat(content: string, senderId: number, chatId: number): Promise<Message> {
		const chat = await this.chatService.getChat(chatId);
		const sender = await this.usersRepository.findOne({where: { id: senderId }});

		if (!chat || !sender) {
			throw new NotFoundException('Chat or sender not found');
		}
		
		return await this.messagesRepository.save({content: content, sender: sender, chat: chat});
	}

	async sendMessageToUser(content: string, senderId: number, recipientId: number): Promise<Message> {
		const sender = await this.usersRepository.findOne({where: { id: senderId }});
		const recipient = await this.usersRepository.findOne({where: { id: recipientId }});
	
		if (!sender || !recipient) {
			throw new NotFoundException('Sender or recipient not found');
		}
	
		// Try to find an existing personal chat between the sender and recipient
		let chat = await this.chatService.findPersonalChat(sender, recipient);
	
		// If no such chat exists, create a new one
		if (!chat) {
			chat = await this.chatService.createPersonalChat(sender, recipient);
		}
	
		// Now we have a chat, either found or newly created, so we can send the message
		const message = new Message();
		message.content = content;
		message.sender = sender;
		message.chat = chat;
		return await this.messagesRepository.save(message);
	}
}