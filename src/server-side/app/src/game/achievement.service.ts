import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { MatchService } from './match.service';
import { Match, Outcome } from './entities/match.entity';

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
		@Inject('ACHIEVEMENT_DEFINITIONS')
		private achievementDefinitions: AchievementDefinition[],
		@Inject(MatchService)
		private matchService: MatchService,
	) {}

	public async getUserAchievements(userId: number): Promise<AchievementRecord[]> {
		const achievements = await this.achievementRepository.find({
			where: { laureateId: userId },
			relations: ['user'],
		});
		return achievements.map(achievement => new UserAchievement(achievement));
	}

	async checkAchievements(userId: number): Promise<void> {
		const matches = await this.matchService.getUsersMatches(userId);
		await this.iterateAchievementDefinitions(matches, userId);
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

	private async iterateAchievementDefinitions(
		matches: Match[],
		userId: number,
	): Promise<void> {
		for (const achievementDefinition of this.achievementDefinitions) {
			const hasAchievement = await this.hasAchievement(userId, achievementDefinition.name);
			if (achievementDefinition.check(matches, userId) && !hasAchievement) {
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

export const ACHIEVEMENT_DEFINITIONS = [
	// Other achievement definitions...
  
	new AchievementDefinition(
		'Winning Streak',
		'Win 5 games in a row',
		(matches: Match[], playerID: number) => {
			if (matches.length < 5) {
				return false;
			}
			const lastMatches = matches.slice(-5);
			return lastMatches.every(match => {
				if (match.player1Score > match.player2Score && match.player1ID === playerID) {
					return true;
				} else if (match.player2Score > match.player1Score && match.player2ID === playerID) {
					return true;
				}
				return false;
			});
		},
	),

	new AchievementDefinition(
		'Underdog',
		'Win a game with a score difference of at least 10',
		(matches: Match[], playerID: number) => matches.some(match => {
			if (match.player1ID === playerID && match.player1Score - match.player2Score >= 10) {
				return true;
			} else if (match.player2ID === playerID && match.player2Score - match.player1Score >= 10) {
				return true;
			}
			return false;
		}),
	),

	new AchievementDefinition(
		'Frequent Player',
		'Play at least 50 games',
		(matches: Match[], playerID: number) => matches.length >= 50,
	),

	new AchievementDefinition(
		'First Time Winner',
		'Win your first game',
		(matches: Match[], playerID: number) => matches.some(match => {
			return (
				(match.player1Score > match.player2Score && match.player1ID === playerID) ||
				(match.player2Score > match.player1Score && match.player2ID === playerID)
			) && (
				match.outcome === Outcome.WON_BY_SCORE || 
				match.outcome === Outcome.WON_BY_TIME
			);
		}),
	),
];
 