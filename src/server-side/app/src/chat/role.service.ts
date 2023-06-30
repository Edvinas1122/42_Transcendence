import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { RoleType, Role, AcceptedRoleType } from './entities/role.entity';
import { Repository, In, Not } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UserInfo } from '../users/dtos/user.dto';
import { ChatEventGateway } from './chat-event.gateway';


@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(Role)
		private roleRepository: Repository<Role>,
	) {}

	
	async getChatRelatives(chat: Chat): Promise<UserInfo[]> {
		const relatives = await this.roleRepository.find({
			where: {
				chat: { id: chat.id },
			},
			relations: ['user'],
		});
		return relatives.filter(relative => relative && relative.user).map(relative => new UserInfo(relative.user, relative.type)); // online status not implemented
	}

	async getChatRoleRelatives(chat: Chat, role: RoleType = RoleType.Blocked): Promise<UserInfo[]> {
		const relatives = await this.roleRepository.find({
			where: { 
				chat: { id: chat.id },
				type: Not(role),
			},
			relations: ['user'],
		});
		return relatives.map(relative => new UserInfo(relative.user, relative.type));
	}

	async getUserRoles(userId: number): Promise<Role[]> {
		const roles = await this.roleRepository.find({
		where: { user: { id: userId } as User },
		relations: ['chat'],
		});
		return roles;
	}

	async getAvailableUserRoles(userId: number): Promise<Role[]> {
		const roles = await this.roleRepository.find({
			where: { user: { id: userId } as User, type: Not(RoleType.Blocked) },
			relations: ['chat'],
		});
	
		return roles;
	}

	async addRelativeToChat(role: RoleType, chat: Chat, user: User): Promise<boolean> {
		try {
			const newRole = new Role();
			newRole.type = role;
			newRole.user = user;
			newRole.chat = chat;

			await this.roleRepository.save(newRole);
			return true;
		} catch (error) {
			return false;
		}
	}

	async removeChatRelative(chat: Chat, userId: number, expectedRole?: RoleType): Promise<boolean> {
		const conditions: any = {
			chat: { id: chat.id },
			user: { id: userId },
		};
		
		if (expectedRole) {
			conditions['type'] = expectedRole;
		}
	
		console.log("here we are");
	
		// Try to find the role first
		const role = await this.roleRepository.findOne({where: conditions});
		
		// If no role found or role type doesn't match expectedRole, throw an exception
		if (!role || (expectedRole && role.type !== expectedRole)) {
			throw new HttpException('The user does not have the expected role', HttpStatus.BAD_REQUEST);
		}
		
		// Delete the role
		await this.roleRepository.remove(role);
		
		// report the event


		return true;
	}

	async removeChatRelatives(chat: Chat, userIds: number[]): Promise<boolean> {
		await this.roleRepository.delete({
		chat: chat,
		user: In(userIds),
		});
		return true;
	}

	async isChatRelative(chat: Chat, userId: number): Promise<boolean> {
		const relative = await this.roleRepository.findOne({
		where: { chat: chat, user: { id: userId } as User },
		});
		return !!relative;
	}

	async getRole(chatId: number, userId: number): Promise<Role | null> {
		const role = await this.roleRepository.findOne({
			where: { chat: { id: chatId }, user: { id: userId }}
		});
		return role;
	}

	async isPrivileged(userId: number, chatId: number): Promise<boolean> {
		const relative = await this.roleRepository.findOne({
			where: { user: { id: userId }, type: In([RoleType.Owner, RoleType.Admin]), chat: { id: chatId } },
		});
		return !!relative;
	}

	async isPermited(userId: number, chatId: number): Promise<boolean> {
		const relative = await this.roleRepository.findOne({
			where: { user: { id: userId }, type: In([RoleType.Owner, RoleType.Admin, RoleType.Participant]), chat: { id: chatId } },
		});
		return !!relative;
	}

	async isParticipant(userId: number, chatId: number): Promise<boolean> {
		const relative = await this.roleRepository.findOne({
			where: { user: { id: userId }, type: In([RoleType.Owner, RoleType.Admin, RoleType.Participant, RoleType.Invited]), chat: { id: chatId } },
		});
		return relative !== null ? true : false;
	}

	async editRole(role: Role, roleType: RoleType): Promise<boolean> {
		role.type = roleType;
		await this.roleRepository.save(role);
		return true;
	}
}

export { RoleType, AcceptedRoleType } from './entities/role.entity';