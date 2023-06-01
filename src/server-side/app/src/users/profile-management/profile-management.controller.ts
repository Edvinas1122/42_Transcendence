import { Controller, Get, Post, Param, Req, Body, UseGuards } from '@nestjs/common';
import { ProfileManagementService } from './profile-management.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@Controller('users/manage')
export class ProfileManagementController {
	constructor(private readonly profileManagementService: ProfileManagementService) {}

		@UseGuards(JwtAuthGuard)
		@Post('send-friend-request')
		async sendFriendRequest(@Req() req: Request, @Body('receiverId') receiverId: number) {
			const currentUserId = req['user']['id'];
			return this.profileManagementService.sendFriendRequest(currentUserId, receiverId);
		}
}