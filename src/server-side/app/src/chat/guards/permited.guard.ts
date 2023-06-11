import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoleType } from '../entities/role.entity';  // import your RolesService
import { RoleService } from '../role.service';

@Injectable()
export class PermitedChatGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private rolesService: RoleService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const userId = request.user.id;
		const chatId = request.params.id; // not sure here

		const isOwnerOrAdmin = await this.rolesService.isPermited(userId, chatId);
		
		// UpdateChatDto should be attached to request.body
		const updateChatDto = request.body;
		
		if (isOwnerOrAdmin && updateChatDto.owner === undefined) {
			return true;
		}

		throw new ForbiddenException('You are not authorized to perform this operation.');
	}
}