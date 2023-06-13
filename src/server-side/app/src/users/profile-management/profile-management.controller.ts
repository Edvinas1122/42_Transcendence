import { Controller, Get, Post, Param, Req, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ProfileManagementService } from './profile-management.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { FriendApproveGuard, FriendRequestGuard } from './guards/post-relationship.guard';
import { UserInfo } from '../dtos/user.dto';
import { Relationship } from './entities/relationship.entity';

@UseGuards(JwtAuthGuard)
@Controller('users/manage')
export class ProfileManagementController {
	constructor(private readonly profileManagementService: ProfileManagementService) {}

		@Post('send-friend-request/:receiverId')
		async sendFriendRequest(@Req() req: Request, @Param('receiverId') receiverId: number): Promise<Relationship> {
			const currentUserId = req['user']['id'];
			console.log("send friend request", currentUserId, receiverId);
			return this.profileManagementService.sendFriendRequest(currentUserId, receiverId);
		}

		@Post('approve-friend-request/:requesterId')
		async approveFriendRequest(@Req() req: Request, @Param('requesterId') requesterId: number): Promise<Relationship> {
			const currentUserId = req['user']['id'];
			return this.profileManagementService.approveFriendRequest(requesterId, currentUserId);
		}

		@Post('reject-friend-request/:requesterId')
		async rejectFriendRequest(@Req() req: Request, @Param('requesterId') requesterId: number): Promise<Boolean> {
			const currentUserId = req['user']['id'];
			return this.profileManagementService.rejectFriendRequest(requesterId, currentUserId);
		}

		@Post('remove-friend/:friendId')
		async removeFriend(@Req() req: Request, @Param('friendId') friendId: number): Promise<Boolean> {
			const currentUserId = req['user']['id'];
			return this.profileManagementService.removeFriend(currentUserId, friendId);
		}

		@Post('block-user/:blockeeId')
		async blockUser(@Req() req: Request, @Param('blockeeId') blockeeId: number): Promise<Boolean> {
			const currentUserId = req['user']['id'];
			return this.profileManagementService.blockUser(currentUserId, blockeeId);
		}

		@Post('unblock-user/:blockeeId')
		async unblockUser(@Req() req: Request, @Param('blockeeId') blockeeId: number): Promise<Boolean> {
			const currentUserId = req['user']['id'];
			return this.profileManagementService.unblockUser(currentUserId, blockeeId);
		}

		@Get('get-all-pending-friend-request')
		async getPendingFriendRequest(@Req() req: Request): Promise<UserInfo[]> {
			const currentUserId = req['user']['id'];
			return this.profileManagementService.getUsersSentRequestTo(currentUserId);
		}

		@Get('get-last-pending-friend-request')
		async getLastPendingFriendRequest(@Req() req: Request): Promise<UserInfo> {
			const currentUserId = req['user']['id'];
			return this.profileManagementService.getLastPendingFriendRequest(currentUserId);
		}

		@Get('get-all-friends')
		async getAllFriends(@Req() req: Request): Promise<UserInfo[]> {
			const currentUserId = req['user']['id'];
			return this.profileManagementService.getAllFriends(currentUserId);
		}

		@Get('get-blocked-users')
		async getBlockedUsers(@Req() req: Request): Promise<UserInfo[]> {
			const currentUserId = req['user']['id'];
			return this.profileManagementService.getPersonallyBlockedUsers(currentUserId);
		}

		
}