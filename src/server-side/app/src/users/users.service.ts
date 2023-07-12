import { ConflictException, Injectable, NotFoundException, Inject, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRuntimeError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfileInfo, UserInfo, UpdateUsernameDto } from './dtos/user.dto';
import { MachHistory } from './dtos/game-stats.dto';
import { Relationship, RelationshipStatus } from './profile-management/entities/relationship.entity';
// import { OnlineStatusService } from '../OnlineStatus/onlineStatus.service';

@Injectable()
export class UsersService {
	constructor(
	@InjectRepository(User)
	private userRepository: Repository<User>,
	) {}

	async getAllUsers(): Promise<User[]> {
		return this.userRepository.find();
	}

	async findAll(): Promise<UserInfo[]> {
		const users = await this.userRepository.find();
		return users.map(user => new UserInfo(user));
	}

	async findAllUsersNotBlocked(id: number): Promise<UserInfo[]> {
		const users = await this.userRepository
		.createQueryBuilder('user')
		.where('user.id NOT IN ' +
			`(SELECT "user2ID" FROM "relationship" WHERE "status" = :status AND "user1ID" = :id 
			UNION ALL 
			SELECT "user1ID" FROM "relationship" WHERE "status" = :status AND "user2ID" = :id)`,
			{ id, status: RelationshipStatus.BLOCKED })
			.getMany();

		return this.setToUsers(users, [id]);
	}

	async findOne(name: string): Promise<User | null> {
		return this.userRepository.findOne({ where: { name } });
	}

	async findUser(id: number): Promise<User | null> {
		return this.userRepository.findOne({ where: { id } });
	}

	private setDefaultAvatar(user: User): User {
		user.avatar = '/avatar-default.png';
		return user;
	}
	
	async getUserProfile(id: number, userid: number): Promise<UserProfileInfo> {
		const resultUser = await this.userRepository.createQueryBuilder("user")
			.where("user.id = :id", { id: id })
			.leftJoinAndSelect("user.matchesAsPlayer1", "matchesAsPlayer1")
			.leftJoinAndSelect("matchesAsPlayer1.player2", "player2")
			.leftJoinAndSelect("user.matchesAsPlayer2", "matchesAsPlayer2")
			.leftJoinAndSelect("matchesAsPlayer2.player1", "player1")
			.leftJoinAndSelect("user.achievements", "achievements")
			.getOne();
		if (!resultUser) {
			throw new NotFoundException('User not found');
		}
		if (await this.isBlocked(id, userid) === true) {
			throw new ForbiddenException('User is blocked');
		}
		const relationship = await this.getRelationshipStatus(id);
		// const onlineStatus = await this.onlineStatusService.getOnlineStatus(id);
		const user: UserProfileInfo = new UserProfileInfo(resultUser, relationship);
		return user;
	}

	async create(user: Partial<User>): Promise<User | null>
	{
		if (!user.name) {
			throw new Error('User name is required');
		}
		let resultUser = await this.findOne(user.name);
		if (resultUser) {
			return null;
		}
		user.avatar = `/avatar-default.png`;
		return await this.userRepository.save(user);
	}

	async createFrom42(info: JSON): Promise<User | null>
	{
		let user = await this.findOne(info['login']);

		if (!user) {
			user = new User();
			user.name = info['login'];
			user.FullName = info['displayname'];
			// user.avatar = info['image']['versions']['small'];
			user.avatar = `/avatar-default.png`;
			user.ImageLinks = info['image']['versions'];
			// user.OriginJson = info;
			
			user = await this.userRepository.save(user);
		}
		return user;
	}

	async getUserInfo(id: number): Promise<UserInfo> {
		const resultUser = await this.userRepository.findOne({ where: { id } });
		if (!resultUser) {
			throw new NotFoundException('User not found');
		}
		const user: UserInfo = new UserInfo(resultUser);
		// user.avatar = process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL + `/avatar/avatar-${id}.png`;
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

	async set2FASecret(secret: string, id: number): Promise<User | null> {
		let user = await this.getUser(id);
		if (!user) {
			return null;
		}
		user.twoFactorAuthSecret = secret;
		return await this.userRepository.save(user);
	}

	async has2FA(id: number): Promise<boolean> {
		let user = await this.getUser(id);
		if (!user) {
			return false;
		}
		return user.twoFactorAuth? true : false;
	}

	async activate2FA(id: number): Promise<User | null> {
		let user = await this.getUser(id);
		if (!user) {
			return null;
		}
		user.twoFactorAuth = true;
		// user.twoFactorAuthenticated = true;
		return await this.userRepository.save(user);
	}

	async deactivate2FA(id: number): Promise<User | null> {
		let user = await this.getUser(id);
		if (!user) {
			return null;
		}
		user.twoFactorAuth = false;
		return await this.userRepository.save(user);
	}

	async validate2FA(id: number): Promise<User | null> {
		let user = await this.getUser(id);
		if (!user) {
			return null;
		}
		// user.twoFactorAuthenticated = true;
		return await this.userRepository.save(user);
	}

	// IF anotherUserId(Blockee) is blocked by userId(Blocker)
	async isBlocked(userId: number, anotherUserId: number): Promise<boolean> {
		if (userId === anotherUserId) {
			return false;
		}
		const userWithRelationships = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['relationshipsInitiated', 'relationshipsReceived']
		});
	
		if (!userWithRelationships) {
			throw new Error('User not found');
		}
	
		const blockedRelationship = userWithRelationships.relationshipsInitiated.find(
			relationship => relationship.user2ID === anotherUserId && relationship.status === RelationshipStatus.BLOCKED
		);
		const blockedRelationship2 = userWithRelationships.relationshipsReceived.find(
			relationship => relationship.user1ID === anotherUserId && relationship.status === RelationshipStatus.BLOCKED
		);
	
		return !!blockedRelationship || !!blockedRelationship2;
	}

	async updateUserName(id: number, newName: string): Promise<User | null> {
		let user = await this.getUser(id);
		if (!user) {
			return null;
		}
		if(newName) {
			let unique = await this.findOne(newName);
			if (unique != null) {
				throw new ConflictException("Username already exists");
			}
			user.name = newName;
		}
		return await this.userRepository.save(user);
	}

	private setToUsers(users: User[], filter?: number[]): UserInfo[] {
		const result: UserInfo[] = [];
		// set all users to UserInfo except that has id in filter
		users.forEach(user => {
			if (!filter || !filter.includes(user.id)) {
				result.push(new UserInfo(user));
			}
		});
		return result;
	}
	
	private async getRelationshipStatus(userId: number): Promise<string> {
		const user = await this.userRepository
		  .createQueryBuilder('user')
		  .leftJoinAndSelect('user.relationshipsInitiated', 'relationshipInitiated')
		  .leftJoinAndSelect('user.relationshipsReceived', 'relationshipReceived')
		  .leftJoin('relationshipInitiated.user2', 'user2')
		  .leftJoin('relationshipReceived.user1', 'user1')
		  .where('user.id = :userId', { userId })
		  .getOne();
	  
	  
		if (user === undefined || user === null) {
		  return 'none';
		}
	  
		const initiatedRelationship = user.relationshipsInitiated?.find(relationship => relationship.user1ID === userId);
		const receivedRelationship = user.relationshipsReceived?.find(relationship => relationship.user2ID === userId);
	  
		if (initiatedRelationship && initiatedRelationship.status === RelationshipStatus.PENDING) {
		  return 'received';
		}
	  
		if (receivedRelationship && receivedRelationship.status === RelationshipStatus.PENDING) {
		  return 'sent';
		}
	  
		if (initiatedRelationship && initiatedRelationship.status === RelationshipStatus.BLOCKED) {
		  return 'blocked';
		}
	  
		if (initiatedRelationship && initiatedRelationship.status === RelationshipStatus.APPROVED) {
		  return 'approved';
		}

		if (receivedRelationship && receivedRelationship.status ===  RelationshipStatus.APPROVED) {
			return 'approved';
		}
	  
		return 'none';
	}

	async updateUser(user: User): Promise<User | null> {
		let resultUser = await this.getUser(user.id);
		if (!resultUser) {
			return null;
		}
		// save to database updated user
		return await this.userRepository.save(user);
	}
}

export { User };