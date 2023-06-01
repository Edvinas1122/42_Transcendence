import { Controller, Get, Query, Post, Body, UseGuards, Req, Res, Redirect } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { FourtyTwoGuard } from './guards/42.guard';
import { Inject } from '@nestjs/common';
import { TmpTokenStore } from './tmpTokenStore.service';


@Controller('auth')
export class AuthController
{
	constructor(private readonly authService: AuthService,
				@Inject(TmpTokenStore) private tokenStore: TmpTokenStore) {}

	@Get('/')
	getHello(): string {
		return 'Hello World!';
	}

	@Get('/token')
	// @UseGuards(FourtyTwoGuard)
	async loginWith42(@Query('tmp_id') code: string): Promise<any>
	{
		const token = this.tokenStore.retrieveTokenLink(code);
		return {token};
	}

	@Get('/redirect')
	@UseGuards(FourtyTwoGuard)
	// @Redirect('http://localhost:3030/', 302)
	async redirect(@Req() req: Request, @Res() res: Response): Promise<any>
	{
		const username = req['user']['profile']['username'];
		const id = req['user']['profile']['id'];
		const accessToken = await this.authService.generateToken({id: id, owner: username});
		// const tokenRetrieveCode = this.tokenStore.storeTokenLink(accessToken, 10);

		res.cookie('access_token', accessToken, { maxAge: 900000, httpOnly: false, secure: false });
		return res.redirect('http://localhost:3030/');
	}
}