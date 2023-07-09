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
		let user = await this.usersService.findOne(login.user);

		if (!user) {
			user = await this.usersService.create({
				name: login.user,
				FullName: login.fullName,
			});
		}
		if (user === null) {
			throw new BadRequestException('User not found');
		}
		const userHas2FA = await this.usersService.has2FA(user.id);
		if (userHas2FA) {
			const tokenRetrieve = await this.generateToken({
				id: user.id,
				owner: login.user,
				only2FA: true,
			});
			return {token: tokenRetrieve, userHas2FA: userHas2FA, id: user.id};
		} else {
			const token = await this.generateToken({
				id: user.id,
				owner: login.user,
			});
			return {token, userHas2FA};
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

