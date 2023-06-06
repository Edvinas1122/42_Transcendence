import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { Participant } from './entities/participants.entity';
import { Invited } from './entities/invited.entity';
import { Blocked } from './entities/blocked.entity';
import { Muted } from './entities/muted.entity';
import { Admin } from './entities/admin.entity';
import { In } from 'typeorm';



@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(Participant)
		private participantRepository: Repository<Participant>,
		@InjectRepository(Invited)
		private invitedRepository: Repository<Invited>,
		@InjectRepository(Blocked)
		private blockedRepository: Repository<Blocked>,
		@InjectRepository(Muted)
		private mutedRepository: Repository<Muted>,
		@InjectRepository(Admin)
		private adminRepository: Repository<Admin>
	) {}

	async getChatParticipants(chat: Chat): Promise<User[]> {
		const participants = await this.participantRepository.find({
		where: { chat: chat },
		relations: ['user'],
		});
		return participants.map(participant => participant.user);
	}

	async getChatParticipantsForUser(userId: number): Promise<Participant[]> {
		const participants = await this.participantRepository.find({
				where: { user: { id: userId } as User },
				relations: ['chat'],
			});
		return participants;
	}

	async addChatParticipant(chat: Chat, userId: number): Promise<boolean> {
		try {
			const participant = new Participant();
			participant.user = { id: userId } as User;
			participant.chat = chat;

			await this.participantRepository.save(participant);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async removeChatParticipant(chat: Chat, userId: number): Promise<void> {
		await this.participantRepository.delete({ chat: chat, user: { id: userId } as User });
	}

	async removeChatParticipants(chat: Chat, userIds: number[]): Promise<void> {
		await this.participantRepository.delete({
			chat: chat,
			user: In(userIds),
		});
	}

	async isChatParticipant(chat: Chat, userId: number): Promise<boolean> {
		const participant = await this.participantRepository.findOne({
				where: { chat: chat, user: { id: userId } as User },
			});
		return !!participant;
	}
}