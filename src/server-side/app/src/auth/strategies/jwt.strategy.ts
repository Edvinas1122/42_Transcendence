import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { extractTokenFromHeaders } from './tokenExtract';

export	const JwtParams = {
		secret: process.env.JWT_SECRET, // Replace with your desired secret key
		signOptions: { expiresIn: '1d' }, // Optionally, set token expiration
	};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      ignoreExpiration: false,
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: extractTokenFromHeaders,
      secretOrKey: JwtParams.secret, // Replace with your secret key
    });
  }

  async validate(payload: any) {
    return { name: payload.owner, id: payload.id };
  }
}