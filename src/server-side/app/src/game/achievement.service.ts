import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { MatchService } from './match.service';
import { Match } from './entities/match.entity';

export interface AchievementRecord {
	_id: number;
	name: string;
	description: string;
	achievedOn: Date;
}

class UserAchievement implements AchievementRecord {
	constructor(achievement: Achievement) {
		this._id = achievement.id;
		this.name = achievement.name;
		this.description = achievement.description;
		this.achievedOn = achievement.createdAt;
	}

	_id: number;
	name: string;
	description: string;
	achievedOn: Date;
}



@Injectable()
export class AchievementService {
	constructor(
		@InjectRepository(Achievement)
		private achievementRepository: Repository<Achievement>,
		@Inject(MatchService)
		private matchService: MatchService,
		private achievementDefinitions: AchievementDefinition[],
	) {}

	public async getUserAchievements(userId: number): Promise<AchievementRecord[]> {
		const achievements = await this.achievementRepository.find({
			where: { laureateId: userId },
			relations: ['user'],
		});
		return achievements.map(achievement => new UserAchievement(achievement));
	}

	public async checkForAchievements(userId: number): Promise<void> {
		const matches = await this.matchService.getPlayersMatches(userId);
		const newAchievement = 
	}

	private createRecord({
		name,
		description,
		laureateId,
	}: Partial<Achievement>): void {
		this.create({
			name,
			description,
			laureateId,
		});
	}

	private async create(data: Partial<Achievement>): Promise<Achievement> {
		const newAchievement = this.achievementRepository.create(data);
		await this.achievementRepository.save(newAchievement);
		return newAchievement;
	}

	async private iterateAchievementDefinitions(
		matches: Match[],
		userId: number,
	): Promise<void> {
		for (const achievementDefinition of this.achievementDefinitions) {
			if (achievementDefinition.check(matches, userId) && await !this.hasAchievement(userId, achievementDefinition.name)) {
				this.createRecord({
					name: achievementDefinition.name,
					description: achievementDefinition.description,
					laureateId: userId,
				});
			}
		}
	}

	private async hasAchievement(userId: number, name: string): Promise<boolean> {
		const achievements = await this.achievementRepository.find({
			where: {
				laureateId: userId,
				name,
			},
		});
		return achievements.length > 0;
	}
}

class AchievementDefinition {
	constructor(
		public name: string,
		public description: string,
		public check: (matches: Match[], playerID: number) => boolean,
	) {}
}

const achievementDefinitions = [
	// Other achievement definitions...
  
	new AchievementDefinition(
		'Winning Streak',
		'Win 5 games in a row',
		(matches: Match[], playerID: number) => {
			// Get the last 5 matches
			const lastMatches = matches.slice(-5);

			// Check if all of them are wins for the player
			return lastMatches.every(match => (match.player1ID === playerID && match.outcome === Outcome.WON_BY_SCORE) || (match.player2ID === playerID && match.outcome === Outcome.WON_BY_TIME));
		},
	),

	new AchievementDefinition(
		'Underdog',
		'Win a game with a score difference of at least 10',
		(matches: Match[], playerID: number) => matches.some(match => Math.abs(match.player1Score - match.player2Score) >= 10),
	),

	new AchievementDefinition(
		'Frequent Player',
		'Play at least 50 games',
		(matches: Match[], playerID: number) => matches.length >= 50,
	),

	new AchievementDefinition(
		'First Time Winner',
		'Win your first game',
		(matches: Match[], playerID: number) => matches.some(match => (match.player1ID === playerID && match.outcome === Outcome.WON_BY_SCORE) || (match.player2ID === playerID && match.outcome === Outcome.WON_BY_TIME)),
	),
  ];
 