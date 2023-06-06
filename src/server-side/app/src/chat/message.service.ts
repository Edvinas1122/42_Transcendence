import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Participant } from './entities/participants.entity';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Chat)
		private chatRepository: Repository<Chat>,
		@InjectRepository(Message)
		private messagesRepository: Repository<Message>,
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async getChatMessages(chatId: number): Promise<Message[]> {
		console.log('getChatMessages');
		const chat = await this.chatRepository.findOne({where: { id: chatId }});
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
		const chat = await this.chatRepository.findOne({where: { id: chatId }});
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
		let chat = await this.chatRepository.findOne({
		  where: { owner: sender, participants: [recipient], personal: true },
		});
	
		// If no such chat exists, create a new one
		if (!chat) {
			const newChat = new Chat();
			newChat.owner = sender;
			newChat.name = `${sender.name}-${recipient.name}`;
			newChat.private = true;
			newChat.personal = true;
			
			// Set participants of the chat
			const participant1 = new Participant();
			participant1.user = sender;
			const participant2 = new Participant();
			participant2.user = recipient;
			newChat.participants = [participant1, participant2];
	
			chat = await this.chatRepository.save(newChat);
		}
	
		// Now we have a chat, either found or newly created, so we can send the message
		const message = new Message();
		message.content = content;
		message.sender = sender;
		message.chat = chat;
		return await this.messagesRepository.save(message);
	}
}