
import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class PreAuthentificationGuard extends AuthGuard('jwt-two-fa') {
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