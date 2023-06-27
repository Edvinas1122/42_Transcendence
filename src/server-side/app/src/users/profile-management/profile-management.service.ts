import { Injectable, Inject, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Relationship, RelationshipStatus } from './entities/relationship.entity';
import { User } from '../entities/user.entity';
import { Repository, Not } from 'typeorm';
import { UserInfo } from '../dtos/user.dto';
import { UserEventGateway, RelationshipType } from '../user-event.gateway';


@Injectable()
export class ProfileManagementService {
	constructor(
		@InjectRepository(Relationship)
		private relationshipsRepository: Repository<Relationship>,
		@Inject(UserEventGateway)
		private readonly eventsGateway: UserEventGateway,
	) {}

	async sendFriendRequest(senderId: number, receiverId: number): Promise<Relationship>{
		if (senderId == receiverId)
			throw new HttpException('You cannot send friend request to yourself', HttpStatus.BAD_REQUEST);
		const relationship = new Relationship();
		relationship.user1ID = senderId;
		relationship.user2ID = receiverId;
		relationship.status = RelationshipStatus.PENDING;
	
		const alreadyExists = await this.relationshipsRepository.findOne({
			where: [
				{ user1ID: senderId, user2ID: receiverId },
				{ user1ID: receiverId, user2ID: senderId }
			]
		});
		if (alreadyExists)
			throw new HttpException('A friend request already exists', HttpStatus.CONFLICT);
		// else if (alreadyExists.status == RelationshipStatus.BLOCKED)
		// 	throw new HttpException('You are blocked by this user', HttpStatus.FORBIDDEN);
		const info = await this.relationshipsRepository.save(relationship);

		this.eventsGateway.sendUserRelationshipEvent(receiverId, RelationshipType.Invited, senderId);
		return info;
	}

	async getAllPendingFriendRequest(receiverId: number): Promise<UserInfo[]> {
		console.log('receiverId', receiverId);
		const pending = await this.relationshipsRepository.find({
			where: { user2ID: receiverId, status: RelationshipStatus.PENDING },
			relations: ["user1"]
		});

		console.log(pending);
		// Extract users from the relationships
		const users = pending.map(rel => rel.user1);
		const usersInfo = users.map(user => new UserInfo(user));

		return usersInfo;
	}

  
	async getUsersSentRequestTo(receiverId: number): Promise<UserInfo[]>
	{
		const relationships = await this.relationshipsRepository.find({
			where: { user2ID: receiverId, status: RelationshipStatus.PENDING },
			relations: ["user1"]
		});
		
		// Extract users from the relationships
		const users = relationships.map(rel => rel.user1);
		const usersInfo = users.map(user => new UserInfo(user));
			
		return usersInfo;
	}

	async getLastPendingFriendRequest( receiverId: number): Promise<UserInfo> {
		const relationship = await this.relationshipsRepository.findOne({
		where: { user2ID: receiverId, status: RelationshipStatus.PENDING },
		relations: ["user1"]
		});

		const user = relationship.user1;

		return new UserInfo(user);
	}
  
	async approveFriendRequest(requestSenderId: number, requestReceiverId: number): Promise<Relationship> {
		console.log("approveFriendRequest");
		const friendRequest = await this.relationshipsRepository.findOne({
				where: {
					user1ID: requestSenderId, 
					user2ID: requestReceiverId,
					status: RelationshipStatus.PENDING
				}
			});

		if (!friendRequest) {
			throw new NotFoundException('Friend request not found');
		} else if (friendRequest.status !== RelationshipStatus.PENDING) {
			throw new HttpException('Friend request is not pending', HttpStatus.CONFLICT);
		}

		friendRequest.status = RelationshipStatus.APPROVED;

		const updatedRelationship = await this.relationshipsRepository.save(friendRequest);

		this.eventsGateway.sendUserRelationshipEvent(requestSenderId, RelationshipType.Approved, requestReceiverId);

		return updatedRelationship;
	}

	async rejectFriendRequest(requestSenderId: number, requestReceiverId: number): Promise<Boolean> {
		const friendRequest = await this.relationshipsRepository.findOne({
			where: {
				user1ID: requestSenderId,
				user2ID: requestReceiverId,
				status: RelationshipStatus.PENDING
			}
		});

		if (!friendRequest) {
			throw new NotFoundException('Friend request not found');
		} else if (friendRequest.status !== RelationshipStatus.PENDING) {
			throw new HttpException('Friend request is not pending', HttpStatus.CONFLICT);
		}

		await this.relationshipsRepository.remove(friendRequest);

		this.eventsGateway.sendUserRelationshipEvent(requestSenderId, RelationshipType.Declined, requestReceiverId);
		return true;
	}

	async removeFriend(userId: number, friendId: number): Promise<Boolean> {
		const relationship = await this.relationshipsRepository.findOne({
			where: [
				{ user1ID: userId, user2ID: friendId, status: RelationshipStatus.APPROVED },
				{ user1ID: friendId, user2ID: userId, status: RelationshipStatus.APPROVED }
			]
		});

		if (!relationship) {
			throw new NotFoundException('Friend not found');
		} else if (relationship.status !== RelationshipStatus.APPROVED) {
			throw new HttpException('Friend request is not approved', HttpStatus.CONFLICT);
		}

		await this.relationshipsRepository.remove(relationship);

		this.eventsGateway.sendUserRelationshipEvent(userId, RelationshipType.Removed, friendId);
		return true;
	}

	async blockUser(userId: number, blockedUserId: number): Promise<Boolean> {
		// find the relationship if exists
		const relationship = await this.relationshipsRepository.findOne({
			where: [
				{ user1ID: userId, user2ID: blockedUserId },
				{ user1ID: blockedUserId, user2ID: userId }
			]
		});
	
		// if there's a relationship, remove it
		if (relationship) {
			await this.relationshipsRepository.remove(relationship);
		}
	
		// create a new relationship where user1ID is the blocker and user2ID is the one being blocked
		const newRelationship = new Relationship();
		newRelationship.user1ID = userId;
		newRelationship.user2ID = blockedUserId;
		newRelationship.status = RelationshipStatus.BLOCKED;
	
		await this.relationshipsRepository.save(newRelationship);
		this.eventsGateway.sendUserRelationshipEvent(userId, RelationshipType.Blocked, blockedUserId);
	
		return true;
	}

	async unblockUser(userId: number, blockedUserId: number): Promise<Boolean> {
		const relationship = await this.relationshipsRepository.findOne({
			where: [
				{ user1ID: userId, user2ID: blockedUserId, status: RelationshipStatus.BLOCKED },
			]
		});

		if (!relationship) {
			throw new NotFoundException('User not found');
		} else if (relationship.status !== RelationshipStatus.BLOCKED) {
			throw new HttpException('User is not blocked', HttpStatus.CONFLICT);
		}
		
		await this.relationshipsRepository.remove(relationship);
		this.eventsGateway.sendUserRelationshipEvent(userId, RelationshipType.Unblocked, blockedUserId);
		return true;
	}


	async getAllFriends(userId: number): Promise<UserInfo[]> {
		const relationships = await this.relationshipsRepository.find({
			where: [
				{ user1ID: userId, status: RelationshipStatus.APPROVED },
				{ user2ID: userId, status: RelationshipStatus.APPROVED }
			],
			relations: ["user1", "user2"]
		});

		// Extract users from the relationships
		const users = relationships.map(rel => {
			if (rel.user1ID === userId)
				return rel.user2;
			else
				return rel.user1;
			}
		);
		const usersInfo = this.setToUsers(users);
		await this.setUsersOnlineStatus(usersInfo);
		return usersInfo;
	}

	async getPersonallyBlockedUsers(userId: number): Promise<any> {
		const relationships = await this.relationshipsRepository.find({
			where: [
				{ user1ID: userId, status: RelationshipStatus.BLOCKED },
			],
			relations: ["user2"]
		});

		// Extract users from the relationships
		const users = relationships.map(rel => rel.user2);
		const usersInfo = users.map(user => new UserInfo(user));
		return usersInfo;
	}

	// async getAllNotBlockedUsers(userId: number): Promise<UserInfo[]> {
	// 	// const users = await this.relationshipsRepository.find({
	// 	//   where: [
	// 	// 	{ user1ID: userId,  },
	// 	// 	{ user2ID: userId,  },
	// 	//   ],
	// 	//   relations: ['user1', 'user2'],
	// 	// });
	// 	const users = await this.usersService.getAllUsers();
	// 	console.log(users);

	// 	const usersInfo = (await users).map(user => {
	// 		if (user.user1ID === userId)
	// 		return new UserInfo(user.user2);
	// 		else
	// 		return new UserInfo(user.user1);
	// 	});
	// 	// await this.setUsersOnlineStatus(usersInfo);

	// 	return usersInfo;
	//   }

	private async setUsersOnlineStatus(users: UserInfo[]): Promise<UserInfo[]> {
		const onlineUsers: number[] = await this.eventsGateway.getAllOnlineUsers();
		users.forEach(user => {
			if (onlineUsers.includes(user._id)) {
				user.Online = true;
			}
		});
		return users;
	}

	private async getBlockedUsers(userId: number): Promise<UserInfo[]> {
		const relationships = await this.relationshipsRepository.find({
			where: [
				{ user1ID: userId, status: RelationshipStatus.BLOCKED },
				{ user2ID: userId, status: RelationshipStatus.BLOCKED }
			],
			relations: ["user1", "user2"]
		});

		// Extract users from the relationships
		const users = relationships.map(rel => {
			if (rel.user1ID === userId)
				return rel.user2;
			else
				return rel.user1;
			}
		);
		const usersInfo = users.map(user => new UserInfo(user));
		return usersInfo;
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

	async getRelationshipStatus(userId: number): Promise<RelationshipStatus> {
	  
		const relationship = await this.relationshipsRepository
		  .createQueryBuilder('relationship')
		  .leftJoinAndSelect('relationship.user1', 'user1')
		  .leftJoinAndSelect('relationship.user2', 'user2')
		  .where('(user1.id = :userId OR user2.id = :userId)', { userId })
		  .getOne();
	  
		return relationship?.status || RelationshipStatus.PENDING;
	}
}