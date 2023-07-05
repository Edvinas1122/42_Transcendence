import { Controller, Get, Req, Post, Param, Body, UseGuards, ParseIntPipe, ValidationPipe, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AchievementService, AchievementRecord } from './achievement.service';
import { MatchService, MatchHistory } from './match.service';

@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
	constructor(
		@Inject(AchievementService)
		private readonly achievementService: AchievementService,
		@Inject(MatchService)
		private readonly matchService: MatchService,
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

	// @Get('invite/:userId')
	
}