import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export	const JwtParams = {
		secret: process.env.JWT_SECRET, // Replace with your desired secret key
		signOptions: { expiresIn: '1d' }, // Optionally, set token expiration
	};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['access_token'];
        }
        return token;
      },
      ignoreExpiration: false,
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtParams.secret, // Replace with your secret key
    });
  }

  async validate(payload: any) {
    return { test: payload.test };
  }
}