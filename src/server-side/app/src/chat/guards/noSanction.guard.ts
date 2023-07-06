import { Injectable, CanActivate, ExecutionContext, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SanctionService } from '../sanction.service';
import { SanctionType } from '../entities/sanction.entity';

@Injectable()
export class NoSanctionGuard implements CanActivate {
	constructor(private readonly sanctionService: SanctionService) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		
		const request = context.switchToHttp().getRequest<Request>();
		if (!request["params"] || !request["params"]["chatId"])
			throw new BadRequestException('ChatId is not provided.');
		const userId = request['user']['id'];
		const chatId = request["params"]["chatId"];

		return this.sanctionService.hasActiveSanction(userId, chatId)
			.then(sanction => {
				if (sanction?.sanctionType === SanctionType.KICKED) {
					const message = `You are currently sanctioned and can not join this chat until ${sanction.sanctionUntil}`;
					throw new ForbiddenException(message);
				}
			return true;
		});
	}
}
