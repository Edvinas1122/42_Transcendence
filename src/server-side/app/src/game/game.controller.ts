import { Controller, Get, Req, Post, Param, Body, UseGuards, ParseIntPipe, ValidationPipe, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AchievementService, AchievementRecord } from './achievement.service';
import { MatchService, MatchHistory } from './match.service';
import { GameService } from './pongGame.service';
import { UserId } from '../utils/user-id.decorator';
import { InviteService } from './invite.service';
import { InviteDto } from './dtos/invite.dto';

interface inviteLink {
	inviteLink: string;
}

@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
	constructor(
		@Inject(AchievementService)
		private readonly achievementService: AchievementService,
		@Inject(MatchService)
		private readonly matchService: MatchService,
		@Inject(InviteService)
		private readonly inviteService: InviteService,
	) {}

	@Get('achievements/:userId')
	async getUserAchievements(
		@Param('userId', new ParseIntPipe()) userId: number
	): Promise<AchievementRecord[]>
	{
		return await this.achievementService.getUserAchievements(userId);
	}

	@Get('match-history/:userId')
	async getUserMatchHistory(
		@Param('userId', new ParseIntPipe()) userId: number
	): Promise<MatchHistory[]>
	{
		return await this.matchService.getPlayersMatches(userId);
	}

	@Post('invite/')
	async invitePlayer(
		@UserId() currentUserId: number,
		@Body(new ValidationPipe({ transform: true })) data: InviteDto,
	): Promise<inviteLink>
	{
		console.log("User found", data.username);
		const inviteCode = await this.inviteService.createInvite(currentUserId, data.username);
		return { inviteLink: inviteCode };
	}
}