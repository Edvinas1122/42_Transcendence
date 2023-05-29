import { Controller, Get, Query, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FourtyTwoGuard } from './guards/42.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('/')
	getHello(): string {
		return 'Hello World!';
	}

	@Post('/42')
	async login(@Body('code') code: string) {
		// const user = await this.authService.generateAccessToken(code);
		console.log(code);
		return code;
	}

	@Get('/login')
	@UseGuards(FourtyTwoGuard)
	async loginWith42()
	{
		return {access_token: await this.authService.generateToken({test: "test"})};
	}

	@Get('/redirect')
	@UseGuards(FourtyTwoGuard)
	async redirect()
	{
		return {access_token: await this.authService.generateToken({test: "test"})};
	}
}