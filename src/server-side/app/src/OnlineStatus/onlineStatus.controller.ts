import { Controller, Get, Inject, Param, UseGuards, ParseIntPipe, NotFoundException} from '@nestjs/common';
import { OnlineStatusService, OnlineStatusResponse } from './onlineStatus.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';


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
		const status = await this.onlineStatusService.getOnlineStatus(id);
		return status;
	}
}
