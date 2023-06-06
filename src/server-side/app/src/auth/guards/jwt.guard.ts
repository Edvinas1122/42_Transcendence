import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	// constructor() {
	// 	super();
	// }

	// canActivate(context: ExecutionContext) {
	// 	// Add your custom authentication logic here
	// 	// for example, call super.logIn(request) to establish a session.
	// 	// console.log('JwtAuthGuard.canActivate');
		
	// 	return super.canActivate(context);
	// }

	// handleRequest(err, user, info, context: ExecutionContext) {
	// 	const httpContext = context.switchToHttp();
	// 	const request = httpContext.getRequest<Request>();
	// 	request.user = user;  // add user to request
	
	// 	return user;
	//   }
}