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
		const { fourtyTwoId, username, photos } = profile;
		const databaseUser = await this.usersService.createFrom42(as_json);
		const image = databaseUser.avatar;
		let id = databaseUser ? databaseUser.id : null;
		const user = {
			accessToken,
			refreshToken,
			profile: {
				id,
				username,
				image,
			},
		};
		done(null, user); // we basically create id for user 
		return { id, username, photos };
	}
}