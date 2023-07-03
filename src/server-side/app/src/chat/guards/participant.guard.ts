import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoleType } from '../entities/role.entity';  // import your RolesService
import { RoleService } from '../role.service';

@Injectable()
export class ParticipantGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private rolesService: RoleService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		if (!request["params"] || !request["params"]["chatId"])
			throw new BadRequestException('ChatId is not provided.');

		const userId = request['user']['id'];
		const chatId = request["params"]["chatId"];

		const role = await this.rolesService.getRole(chatId, userId);
		if (role && (role.type !== RoleType.Blocked && role.type !== RoleType.Invited))
			return true;

		throw new ForbiddenException('You are not authorized to perform this operation.');
	}
}