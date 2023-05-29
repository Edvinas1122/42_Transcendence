import { Controller, Get, Query, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { FourtyTwoGuard } from './guards/42.guard';
// import { CookiesService } from '@nestjs/cookies';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('/')
	getHello(): string {
		return 'Hello World!';
	}

	@Get('/login')
	@UseGuards(FourtyTwoGuard)
	async loginWith42()
	{
		return {access_token: await this.authService.generateToken({test: "test"})};
	}

	@Get('/redirect')
	@UseGuards(FourtyTwoGuard)
	async redirect(@Req() req: Request, @Res() res: Response): Promise<any>
	{
		const accessToken = await this.authService.generateToken({test: "test"});

		console.log("here we are");
		res.cookie('access_token', accessToken, { maxAge: 900000, httpOnly: true, secure: false });
		// return res.redirect('http://localhost:3000/users/dummy');
		res.send({access_token: accessToken});
		// return {access_token: accessToken};
	}
}