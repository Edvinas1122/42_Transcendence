import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { extractTokenFromHeaders } from './tokenExtract';
import { UsersService } from '../../users/users.service';

export	const JwtParams = {
		secret: process.env.JWT_SECRET, // Replace with your desired secret key
		signOptions: { expiresIn: '1d' }, // Optionally, set token expiration
	};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private userService: UsersService,
	) {
		super({
			ignoreExpiration: false,
			jwtFromRequest: extractTokenFromHeaders,
			secretOrKey: JwtParams.secret, // Replace with your secret key
		});
	}
	
	async validate(payload: any) {
		const user = await this.userService.findUser(payload.id);
		// const user = await this.userService.findUserByFullName(payload.id);
		if (!user) {
			throw new UnauthorizedException('Access denied');
		}
		if (payload?.only2FA == true) {
			throw new UnauthorizedException('2FA required');
		}
		return { name: payload.owner, id: payload.id};
	}
}