import { Controller, Get, Post, Param, Req, Body, UseGuards } from '@nestjs/common';
import { ProfileManagementService } from './profile-management.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { FriendApproveGuard, FriendRequestGuard } from './guards/post-relationship.guard';

@UseGuards(JwtAuthGuard)
@Controller('users/manage')
export class ProfileManagementController {
	constructor(private readonly profileManagementService: ProfileManagementService) {}

		// @UseGuards(FriendRequestGuard)
		@Post('send-friend-request')
		async sendFriendRequest(@Req() req: Request, @Body('receiverId') receiverId: number) {
			const currentUserId = req['user']['id'];
			// console.log(currentUserId);
			return this.profileManagementService.sendFriendRequest(currentUserId, receiverId);
		}

		@UseGuards(FriendApproveGuard)
		@Post('approve-friend-request')
		async approveFriendRequest(@Req() req: Request, @Body('receiverId') receiverId: number) {
			const currentUserId = req['user']['id'];
			return this.profileManagementService.approveFriendRequest(currentUserId, receiverId);
		}

		@Get('get-all-pending-friend-request')
		async getPendingFriendRequest(@Req() req: Request) {
			const currentUserId = req['user']['id'];
			return this.profileManagementService.getUsersSentRequestTo(currentUserId);
		}

		@Get('get-last-pending-friend-request')
		async getLastPendingFriendRequest(@Req() req: Request) {
			const currentUserId = req['user']['id'];
			// const currentUserId = 1;
			return this.profileManagementService.getLastPendingFriendRequest(currentUserId);
		}


}