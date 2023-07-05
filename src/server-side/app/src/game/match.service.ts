import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';

export interface MatchHistory {
	_id: number;
	opponent: string;
	userScore: number;
	opponentScore: number;
	completed: boolean;
	created?: Date;
	gameType?: string;
}

class MatchRecord implements MatchHistory {
	constructor(match: Match, currentUserId: number)
	{
		this._id = match.id;
		this.opponent = match.player1ID === currentUserId ? match.player2.name : match.player1.name;
		this.userScore = match.player1ID === currentUserId ? match.player1Score : match.player2Score;
		this.opponentScore = match.player1ID === currentUserId ? match.player2Score : match.player1Score;
		this.completed = match.outcome !== 'DISCONNECTED';
		this.created = match.gameEndDate;
		this.gameType = match.gameType;
	}
	_id: number;
	opponent: string;
	userScore: number;
	opponentScore: number;
	completed: boolean;
	created?: Date;
	gameType?: string;
}

@Injectable()
export class MatchService {
	constructor(
		@InjectRepository(Match)
		private matchRepository: Repository<Match>,
	) {}

	public async getPlayersMatches(userID: number): Promise<MatchHistory[]> {
		const matches = await this.matchRepository.find({
			where: [
				{ player1ID: userID },
				{ player2ID: userID },
			],
			relations: ['player1', 'player2'],
		});
		return matches.map(match => new MatchRecord(match, userID));
	}

	createRecord({
		gameType,
		outcome,
		player1Score,
		player1ID,
		player2Score,
		player2ID,
		gameEndDate,
	}: Partial<Match>): void {
		this.create({
			gameType,
			outcome,
			player1Score,
			player1ID,
			player2Score,
			player2ID,
			gameEndDate,
		});
	}

	private async create(data: Partial<Match>): Promise<Match> {
		const newMatch = this.matchRepository.create(data);
		await this.matchRepository.save(newMatch);
		return newMatch;
	}

}