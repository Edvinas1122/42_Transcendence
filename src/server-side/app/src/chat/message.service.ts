import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { RoleService } from './role.service';
import { UsersService } from '../users/users.service';


@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private messagesRepository: Repository<Message>,
		@Inject(UsersService)
		private usersService: UsersService,
		@Inject(ChatService)
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

	async sendMessageToChat(content: string, senderId: number, password: string, chatId: number): Promise<Message> {
		const chat = await this.chatService.getChat(chatId);
		const sender = await this.usersService.findUser(senderId);

		if (!chat || !sender) {
			throw new NotFoundException('Chat or sender not found');
		}
		if (chat.password && chat.password !== password || chat.password === '' && password !== '') {
			throw new UnauthorizedException('Wrong password');
		}

		return await this.messagesRepository.save({content: content, sender: sender, chat: chat});
	}

	async sendMessageToUser(content: string, senderId: number, recipientId: number): Promise<Message> {
	
		const sender = await this.usersService.findUser(senderId);
		
		if (!sender) {
			throw new NotFoundException('Sender not found');
		}
		
		let chat = await this.chatService.findPersonalChat(sender, recipientId);
		if (!chat) {
			chat = await this.chatService.createPersonalChat(sender, recipientId);
		}
	
		// Now we have a chat, either found or newly created, so we can send the message
		const message = new Message();
		message.content = content;
		message.sender = sender;
		message.chat = chat;
		return await this.messagesRepository.save(message);
	}
}