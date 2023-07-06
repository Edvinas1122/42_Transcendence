import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MatchService, Outcome } from './match.service';
import { Match } from './entities/match.entity';
import { AchievementService } from './achievement.service';

@Injectable()
export class RankService {
	constructor(
		@Inject(UsersService)
		private userService: UsersService,
		@Inject(MatchService)
		private matchService: MatchService,
		@Inject(AchievementService)
		private achievementService: AchievementService,
	) {}

	async updateRanks(match: Match) {
		// Get all users
		const users = await this.userService.getAllUsers();

		// Calculate score for each user
		const userScores = await Promise.all(users.map(async (user) => {
		const matches = await this.matchService.getMachesByUserId(user.id);
		let score = 0;
		for (const match of matches) {
			if (match.outcome === Outcome.WON_BY_SCORE || match.outcome === Outcome.WON_BY_TIME) {
			if (match.player1ID === user.id) {
				score += match.player1Score;
			} else if (match.player2ID === user.id) {
				score += match.player2Score;
			}
			}
		}
		return { userId: user.id, score };
		}));

		// Sort users by score
		userScores.sort((a, b) => b.score - a.score);

		// Assign ranks based on sorted scores
		for (let i = 0; i < userScores.length; i++) {
		const user = users.find(u => u.id === userScores[i].userId);
		if (user) {
			user.rank = i + 1; // Assign rank (rank starts from 1)
			await this.userService.updateUser(user); // Update user with new rank
		}
		}
	}
}