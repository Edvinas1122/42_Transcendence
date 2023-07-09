import { ExecutionContext, CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
	) {
		super();
	}

	handleRequest(err, user, info: Error) {
		if (err || !user) {
			throw err || new UnauthorizedException("Unauthorised");
		}
		return user;
	}
}