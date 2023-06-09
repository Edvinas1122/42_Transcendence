import { Controller, Get, UseGuards, Req, Res, Param, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService, LoginRegister } from './auth.service';
import { Inject } from '@nestjs/common';
import { UsersService, User } from '../users/users.service';
import { randWords } from './utils/rand.words';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserId } from '../utils/user-id.decorator';


@Controller('auth')
export class AuthController
{
	constructor(
		@Inject(UsersService)
		private readonly usersService: UsersService,
		@Inject(AuthService)
		private readonly authService: AuthService,		
	) {}

	@Get('/DevToken/') // development only
	async getToken(): Promise<any>
	{
		if (process.env.DEV !== 'true') { // if not in dev mode, throw an error
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		}
		const randomName = randWords(2);
		const randomId = Math.floor(Math.random() * 1000000);

		const newUser = {
			id: randomId,
			name: randomName, // assuming username corresponds to the 'name' in User entity
			avatar: "", // default avatar if any or you can leave this field to be updated later
			ImageLinks: {}, // default empty json or you can leave this field to be updated later
			FullName: "", // full name if any or you can leave this field to be updated later
			// createdAt will be automatically generated by the typeORM
		}
		const newUserHere = await this.usersService.create(newUser as User);
		const accessToken = await this.authService.generateToken({id: newUserHere.id, owner: newUserHere.name});
		return {accessToken};
	}

	@Get('/DevUser2FA/') // development only
	async get2FAToken(): Promise<any>
	{
		if (process.env.DEV !== 'true') { // if not in dev mode, throw an error
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		}
		const randomName = randWords(2);
		const randomId = Math.floor(Math.random() * 1000000);

		const newUser = {
			id: randomId,
			name: randomName, // assuming username corresponds to the 'name' in User entity
			avatar: "", // default avatar if any or you can leave this field to be updated later
			ImageLinks: {}, // default empty json or you can leave this field to be updated later
			FullName: "", // full name if any or you can leave this field to be updated later
			// createdAt will be automatically generated by the typeORM
			twoFactorAuth: true,
		}
		const newUserHere = await this.usersService.create(newUser as User);
		const accessToken = await this.authService.generateToken({id: newUserHere.id, owner: newUserHere.name});
		return {accessToken};
	}

	@Get('/DevUser/')
	async getDevUser(@Res() res: Response,): Promise<any>
	{
		if (process.env.DEV !== 'true') { // if not in dev mode, throw an error
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		}
		const randomName = randWords(2);
		const randomId = Math.floor(Math.random() * 1000000);

		const newUser = { 
			id: randomId,
			name: randomName, // assuming username corresponds to the 'name' in User entity
			avatar: "", // default avatar if any or you can leave this field to be updated later
			ImageLinks: {}, // default empty json or you can leave this field to be updated later
			FullName: "", // full name if any or you can leave this field to be updated later
			// createdAt will be automatically generated by the typeORM
		}
		const newUserHere = await this.usersService.create(newUser as User);
		const accessToken = await this.authService.generateToken({id: newUserHere.id, owner: newUserHere.name});
		// res.cookie('access_token', accessToken, { maxAge: 9000000000, httpOnly: false, secure: false });
		res.cookie('access_token', accessToken, { 
			maxAge: 9000000000, 
			httpOnly: false, 
			secure: true, // set secure to true
			sameSite: 'none' // set sameSite to 'none'
		});
		return res.redirect(process.env.FRONT_END_API);
	}

	// @Get('/redirect')
	// @UseGuards(FourtyTwoGuard)
	// async redirect(@Req() req: Request, @Res() res: Response): Promise<any>
	// {
	// 	const username = req['user']['profile']['username'];
	// 	const id = req['user']['profile']['id'];
	// 	const accessToken = await this.authService.generateToken({id: id, owner: username});
	// 	// const tokenRetrieveCode = this.tokenStore.storeTokenLink(accessToken, 10);

	// 	res.cookie('access_token', accessToken, { maxAge: 9000000000, httpOnly: false, secure: false });
	// 	return res.redirect(process.env.FRONT_END_API);
	// }

	@Post('/register')
	async registerAuthorizedLogin(
		@Req() req: Request
	): Promise<any>
	{
		const { user, fullName, server_secret } = req.body as LoginRegister;
		if (server_secret === undefined || server_secret !== process.env.SERVER_SECRET) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}
		const {token, userHas2FA, id, firstTime} = await this.authService.registerAuthorizedLogin({
			user: user,
			fullName : fullName,
		});
		return {retrieve: token, HAS_2_FA: userHas2FA, id: id, firstTime: firstTime};
	}

	@Get('validate')
	@UseGuards(JwtAuthGuard)
	async validate(
		@UserId() currentUserId: number
	): Promise<any>
	{
		return {validated: true};
	}
}