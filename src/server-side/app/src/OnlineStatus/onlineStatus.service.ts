import { Injectable, Inject } from '@nestjs/common';
import { EventService } from '../events/events.service';
import { GameService } from '../game/pongGame.service';

export interface OnlineStatusResponse {
	status: 'online' | 'offline' | 'InGame';
}

@Injectable()
export class OnlineStatusService {
	constructor(
		@Inject(EventService)
		private eventService: EventService,
		@Inject(GameService)
		private readonly gameService: GameService,
	) {}

	async getOnlineStatus(userId: number): Promise<OnlineStatusResponse> {
		const status = this.eventService.seeIfUserIsOnline(userId.toString());
		if (status) {
			const game = this.gameService.userIsInGame(userId);
			if (game) {
				return { status: 'InGame' };
			}
			return { status: 'online' };
		}
		return { status: 'offline' };
	}
}

