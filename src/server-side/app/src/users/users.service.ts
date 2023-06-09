import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfileInfo } from './dtos/user.dto';
import { MachHistory } from './dtos/game-stats.dto';

@Injectable()
export class UsersService {
	constructor(
	@InjectRepository(User)
	private userRepository: Repository<User>,
	) {}

	async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	async findOne(name: string): Promise<User | null> {
		return this.userRepository.findOne({ where: { name } });
	}

	async getUserProfile(id: number): Promise<UserProfileInfo> {
		const resultUser = await this.userRepository.findOne({ where: { id } });
		if (!resultUser) {
			throw new NotFoundException('User not found');
		}
		const user: UserProfileInfo = new UserProfileInfo(resultUser);
		// user.avatar = process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL + `/avatar/avatar-${id}.png`;
		return user;
	}

	async create(user: User): Promise<User | null>
	{
		if (!user.name) {
			throw new Error('User name is required');
		}
		let resultUser = await this.findOne(user.name);
		if (resultUser) {
			return null;
		}
		return await this.userRepository.save(user);
	}

	async createFrom42(info: JSON): Promise<User | null>
	{
		let user = await this.findOne(info['login']);

		if (!user) {
			user = new User();
			user.name = info['login'];
			user.FullName = info['displayname'];
			user.avatar = info['image']['versions']['small'];
			user.ImageLinks = info['image']['versions'];
			// user.OriginJson = info;
			
			user = await this.userRepository.save(user);
		}
	
		return user;
	}

	async getUser(id: number): Promise<User | null> {
		return await this.userRepository.findOne({ where: { id } });
	}

	async updateAvatar(id: number, avatar: string): Promise<User | null> {
		let user = await this.getUser(id);
		if (!user) {
			return null;
		}
		user.avatar = avatar;
		return await this.userRepository.save(user);
	}

}