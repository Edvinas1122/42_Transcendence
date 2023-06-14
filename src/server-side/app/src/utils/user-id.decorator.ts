import { createParamDecorator, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';

export const UserId = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		if (!request['user'] || !request['user']['id']) {
			throw new UnauthorizedException('Unauthorized');
		}
		const userId = Number(request['user']['id']);
		if (isNaN(userId)) {
			throw new BadRequestException('User ID must be a number');
		}
		return userId;
	},
);