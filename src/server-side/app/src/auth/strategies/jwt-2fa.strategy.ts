import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { extractTokenFromHeaders } from './tokenExtract';
import { UsersService } from '../../users/users.service';

export	const JwtParams = {
    secret: process.env.JWT_SECRET, // Replace with your desired secret key
    signOptions: { expiresIn: '1d' }, // Optionally, set token expiration
};

@Injectable()
export class JwtTwoFaStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
    constructor(
        private usersService: UsersService
    ) {
        super({
			ignoreExpiration: false,
			jwtFromRequest: extractTokenFromHeaders,
			secretOrKey: JwtParams.secret, // Replace with your secret key
		});
    }

    async validate(payload: any) {
        const user = await this.usersService.findUser(payload.id);
        if (!user) {
            throw new UnauthorizedException()
        }

        if (!user.twoFactorAuth) {
            return { name: payload.owner, id: payload.id};
        }
        if (user.twoFactorAuthenticated) {
            return { name: payload.owner, id: payload.id};
        }
    }
}