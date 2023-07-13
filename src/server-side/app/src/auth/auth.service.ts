import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

export interface LoginRegister {
	user: string,
	fullName: string,
	server_secret?: string,
}

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		@Inject(UsersService)
		private readonly usersService: UsersService,
	) {}

	async registerAuthorizedLogin(login: LoginRegister): Promise<any> {
		let user = await this.usersService.findUserByFullName(login.fullName);
		let firstTime = false;

		if (!user) {
			user = await this.usersService.create({
				name: login.user,
				FullName: login.fullName,
			});
			firstTime = true;
		}
		if (user === null) {
			throw new BadRequestException('User not found');
		}
		const userHas2FA = await this.usersService.has2FA(user.id);
		// const userHas2FA = false;
		if (userHas2FA) {
			const tokenRetrieve = await this.generateToken({
				id: user.id,
				owner: login.user,
				only2FA: true,
			});
			return {token: tokenRetrieve, userHas2FA: userHas2FA, id: user.id, firstTime: firstTime};
		} else {
			const token = await this.generateToken({
				id: user.id,
				owner: login.user,
				// id: 1,
				// owner: "test",
			});
			return {token, userHas2FA, firstTime: firstTime};
		}
	}

	async generateToken(payload: any): Promise<string> {
		return this.jwtService.sign(payload);
	  }

	async validateToken(token: string): Promise<any> {
		return this.jwtService.verify(token);
	}

	async getTokenPayload(token: string): Promise<any> {
		return this.jwtService.decode(token);
	}
}

