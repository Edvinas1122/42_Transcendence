import { Controller, Get, Post, Param, Req, Body, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ProfileManagementService } from './profile-management.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { FriendApproveGuard, FriendRequestGuard } from './guards/post-relationship.guard';
import { UserInfo } from '../dtos/user.dto';
import { Relationship } from './entities/relationship.entity';
import { UserId } from '../../utils/user-id.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users/manage')
export class ProfileManagementController {
	constructor(
		private readonly profileManagementService: ProfileManagementService
	) {}

	@Post('send-friend-request/:receiverId')
	async sendFriendRequest(@UserId() currentUserId: number, @Param('receiverId', new ParseIntPipe()) receiverId: number): Promise<Relationship> {
		console.log("send friend request", currentUserId, receiverId);
		return this.profileManagementService.sendFriendRequest(currentUserId, receiverId);
	}

	@Post('approve-friend-request/:requesterId')
	async approveFriendRequest(@UserId() currentUserId: number, @Param('requesterId', new ParseIntPipe()) requesterId: number): Promise<Relationship>
	{
		return this.profileManagementService.approveFriendRequest(requesterId, currentUserId);
	}

	@Post('reject-friend-request/:requesterId')
	async rejectFriendRequest(@UserId() currentUserId: number, @Param('requesterId', new ParseIntPipe()) requesterId: number): Promise<Boolean>
	{
		return this.profileManagementService.rejectFriendRequest(requesterId, currentUserId);
	}

	@Post('remove-friend/:friendId')
	async removeFriend(@UserId() currentUserId: number, @Param('friendId', new ParseIntPipe()) friendId: number): Promise<Boolean> 
	{
		return this.profileManagementService.removeFriend(currentUserId, friendId);
	}

	@Post('block-user/:blockeeId')
	async blockUser(@UserId() currentUserId: number, @Param('blockeeId', new ParseIntPipe()) blockeeId: number): Promise<Boolean> 
	{
		return this.profileManagementService.blockUser(currentUserId, blockeeId);
	}

	@Post('unblock-user/:blockeeId')
	async unblockUser(@UserId() currentUserId: number, @Param('blockeeId', new ParseIntPipe()) blockeeId: number): Promise<Boolean> 
	{
		return this.profileManagementService.unblockUser(currentUserId, blockeeId);
	}

	// @Get('get-all')
	// async getAllUsers(@UserId() currentUserId: number): Promise<UserInfo[]>
	// {
	// 	return this.profileManagementService.getAllNotBlockedUsers(currentUserId);
	// }

	@Get('get-all-pending-friend-request')
	async getPendingFriendRequest(@UserId() currentUserId: number): Promise<UserInfo[]> 
	{
		const users = await this.profileManagementService.getAllPendingFriendRequest(currentUserId);
		console.log("get all pending friend request", users);
		return users;
	}

	@Get('get-last-pending-friend-request')
	async getLastPendingFriendRequest(@UserId() currentUserId: number): Promise<UserInfo> 
	{
		return this.profileManagementService.getLastPendingFriendRequest(currentUserId);
	}

	@Get('get-all-friends')
	async getAllFriends(@UserId() currentUserId: number): Promise<UserInfo[]> 
	{
		return this.profileManagementService.getAllFriends(currentUserId);
	}

	@Get('get-blocked-users')
	async getBlockedUsers(@UserId() currentUserId: number): Promise<UserInfo[]> 
	{
		return this.profileManagementService.getPersonallyBlockedUsers(currentUserId);
	}	
}
