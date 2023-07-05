import { Controller, Get, Req, Post, Param, Body, UseGuards, ParseIntPipe, ValidationPipe, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AchievementService, AchievementRecord } from './achievement.service';
import { MatchService, MatchHistory } from './match.service';
import { GameService } from './pongGame.service';
import { UserId } from '../utils/user-id.decorator';

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
		@Inject(GameService)
		private readonly gameService: GameService
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
		@Body() data: { userName: string }

	): Promise<inviteLink>
	{
		console.log("User found", data);
		return await this.gameService.inviteToGame(currentUserId, data.userName, 1);
	}
}