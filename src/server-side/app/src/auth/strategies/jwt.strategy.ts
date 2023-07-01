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
		const user = this.userService.findUser(payload.id);
		if (!user) {
			console.log('User not found, Access denied');
			throw new UnauthorizedException();
		}
		return { name: payload.owner, id: payload.id };
	}
}