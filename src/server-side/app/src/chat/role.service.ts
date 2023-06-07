import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { RoleType, Role } from './entities/role.entity';
import { Repository, In, Not } from 'typeorm';
import { UsersService } from '../users/users.service';


@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(Role)
		private roleRepository: Repository<Role>,
		// @InjectRepository(UsersService)
		// private usersService: UsersService,
	) {}

	async getChatRelatives(role: RoleType, chat: Chat): Promise<User[]> {
		const relatives = await this.roleRepository.find({
		where: { chat: chat, type: role },
		relations: ['user'],
		});
		return relatives.map(relative => relative.user);
	}

	async getUserRoles(userId: number): Promise<Role[]> {
		const roles = await this.roleRepository.find({
		where: { user: { id: userId } as User },
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
			console.error(error);
		return false;
		}
	}

	async removeChatRelative(chat: Chat, userId: number): Promise<boolean> {
		await this.roleRepository.delete({
		chat: chat,
		user: { id: userId } as User,
		});
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

	async getRole(chatId: number, userId: number): Promise<Role> {
		const role = await this.roleRepository.findOne({
				where: { chat: { id: chatId }, user: { id: userId }}
			});
		if (!role) {
			throw new NotFoundException('Role not found');
		}
		return role;
	}

	// async editRole(chat: Chat, user: User, role: RoleType): Promise<boolean> {

	// 	const relative = await this.roleRepository.findOne({
	// 		where: { chat: {id: chat.id}, user: {id: user.id} },
	// 	});
	// 	if (!relative) {
	// 		throw new NotFoundException('Relative not found');
	// 	}
	// 	relative.type = role;
	// 	await this.roleRepository.save(relative);
	// 	return true;
	// }

	async editRole(role: Role, roleType: RoleType): Promise<boolean> {
		role.type = roleType;
		await this.roleRepository.save(role);
		return true;
	}
}

export { RoleType } from './entities/role.entity';