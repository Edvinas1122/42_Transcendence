import { Controller, Get, Req, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserProfileInfo, UserInfo } from './dtos/user.dto';
import { UserId } from '../utils/user-id.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
	) {}

	@Get('all')
	async findAllUsers(@UserId() currentUserId: number): Promise<UserInfo[]>
	{
		const users = await this.usersService.findAllUsersNotBlocked(currentUserId);

		// const users = await this.usersService.findAll();
		return users;
	}

	@Get('me')
	async findCurrentUser(@UserId() currentUser: number): Promise<UserProfileInfo>
	{
		const user = await this.usersService.getUserProfile(currentUser);
		return user;
	}

	@Get('profile/:id')
	async findUser(@UserId() userId: number, @Param('id', new ParseIntPipe()) requesteeId: number): Promise<UserProfileInfo>
	{
		const requestee = await this.usersService.getUserProfile(requesteeId);
		return requestee;
	}
}
