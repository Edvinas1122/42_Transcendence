import { Controller, Get, Inject, Param, UseGuards, ParseIntPipe, NotFoundException} from '@nestjs/common';
import { OnlineStatusService } from './onlineStatus.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

interface OnlineStatusResponse {
	status: 'online' | 'offline' | 'InGame';
}

@UseGuards(JwtAuthGuard)
@Controller('online-status')
export class OnlineStatusController {
	constructor(
		@Inject(OnlineStatusService)
		private onlineStatusService: OnlineStatusService,
	) {}

	@Get(':id')
	async getOnlineStatus(
		@Param('id', new ParseIntPipe()) id: number,
	): Promise<OnlineStatusResponse> {
		const online = await this.onlineStatusService.getOnlineStatus(id);
		return { status: online ? 'online' : 'offline' };
	}
}
