import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';

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
	) {}

	public async getUserAchievements(userId: number): Promise<AchievementRecord[]> {
		const achievements = await this.achievementRepository.find({
			where: { laureateId: userId },
			relations: ['user'],
		});
		return achievements.map(achievement => new UserAchievement(achievement));
	}

	createRecord({
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
}