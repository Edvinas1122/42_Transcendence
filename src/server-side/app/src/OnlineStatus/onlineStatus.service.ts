import { Injectable, Inject } from '@nestjs/common';
import { EventService } from '../events/events.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class OnlineStatusService {
	constructor(
		@Inject(EventService)
		private eventService: EventService,
		@Inject(SocketGateway)
		private socketGateway: SocketGateway,
	) {}

	public async getOnlineStatus(userId: number): Promise<boolean> {
		const status = this.eventService.seeIfUserIsOnline(userId.toString());
		return status;
	}
}

