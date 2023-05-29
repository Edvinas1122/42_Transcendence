import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UsersService } from '../../users/users.service';
import { Inject } from '@nestjs/common';

export class FourtyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor(@Inject(UsersService) private readonly usersService: UsersService) {
		super({
			clientID: process.env.INTRA_UID,
			clientSecret: process.env.INTRA_SECRET,
			callbackURL: process.env.INTRA_REDIRECT_URI,
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: Function)
	{
		const as_json = profile._json;
		const { id, username, photos } = profile;
		const image = as_json['image']['link'];
		const user = {
			accessToken,
			refreshToken,
			profile: {
				id,
				username,
				image,
			},
		};
		console.log(as_json['image']['link']);
		this.usersService.create2(profile); // I hate it, it breaks sence, because every OAuth2 strategy gonna implament this method
		done(null, user);
		return { id, username, photos };
	}
}