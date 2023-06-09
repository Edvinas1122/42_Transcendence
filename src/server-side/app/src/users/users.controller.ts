import { Controller, Get, Req, Post, Body } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserProfileInfo } from './dtos/user.dto';

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('all')
	async findAllUsers(@Req() req: Request): Promise<User[]> {
		console.log(req['user']['name']);
		return await this.usersService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async findCurrentUser(@Req() req: Request): Promise<UserProfileInfo> {
		const currentUser = req['user']['id'];
		const user = await this.usersService.getUserProfile(currentUser);
		return user;
	}

	@UseGuards(JwtAuthGuard)
	@Get('dummy')
	findAllDummy() {
		return [
			{ id: 1, name: 'Dummy User 1', email: 'dummy1@email.com' },
			{ id: 2, name: 'Dummy User 2', email: 'dummy2@email.com' },
			{ id: 3, name: 'Dummy User 3', email: 'dummy3@email.com' },
		];
	}

	@Post()
	async createUser(@Body() user: User): Promise<User | null>
	{
		const resultUser = await this.usersService.create(user);
		if (resultUser)
			return resultUser;
		return user;
	}
}
