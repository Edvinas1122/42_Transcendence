import { Controller, Get, Req, Post, Body, Param } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserProfileInfo } from './dtos/user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
	) {}

	@Get('all')
	async findAllUsers(@Req() req: Request): Promise<User[]> {
		console.log(req['user']['name']);
		return await this.usersService.findAll();
	}

	@Get('me')
	async findCurrentUser(@Req() req: Request): Promise<UserProfileInfo> {
		const currentUser = req['user']['id'];
		const user = await this.usersService.getUserProfile(currentUser);
		return user;
	}

	// Blocked Guard
	@Get('profile/:id')
	async findUser(@Req() req: Request, @Param() requesteeId: number): Promise<UserProfileInfo> {
		const currentUser = req['user']['id'];
		const requestee = await this.usersService.getUserProfile(requesteeId);
		return requestee;
	}

	// @Post()
	// async createUser(@Body() user: User): Promise<User | null>
	// {
	// 	const resultUser = await this.usersService.create(user);
	// 	if (resultUser)
	// 		return resultUser;
	// 	return user;
	// }
}
