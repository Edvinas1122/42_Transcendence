import { Controller, Get, Query, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
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
	async redirect(@Req() req: Request, @Res() res: Response): Promise<any>
	{
		const accessToken = await this.authService.generateToken({test: "test"});
		const tokenRetrieveCode = this.tokenStore.storeTokenLink(accessToken, 10);

		res.cookie('access_token', accessToken, { maxAge: 900000, httpOnly: false, secure: false });
		return res.redirect('http://localhost:3030/');
		// return res.redirect('http://localhost:3030/' + '?retrieveToken=' + tokenRetrieveCode);
	}
}