import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
	constructor() {}

	@Get('/')
	getHello(): string {
		return 'Hello World!';
	}
}