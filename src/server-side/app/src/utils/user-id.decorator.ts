import { createParamDecorator, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';

export const UserId = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		if (!request['user'] || !request['user']['id']) {
			throw new UnauthorizedException('Token contains no user information');
		}
		const userId = Number(request['user']['id']);
		if (isNaN(userId)) {
			throw new UnauthorizedException('Token contains no user id');
		}
		return userId;
	},
);

export const UserName = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		if (!request['user'] || !request['user']['name']) {
			console.log(request['user']);
			throw new UnauthorizedException('Token contains no owner information');
		}
		return request['user']['name'];
	}
);