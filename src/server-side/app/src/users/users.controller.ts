import { Controller, Get, Req, Post, Body, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards, } from '@nestjs/common';
import { JwtTwoFactorGuard } from '../auth/guards/jwt-2fa.guard';
import { UserProfileInfo, UserInfo, UpdateUsernameDto } from './dtos/user.dto';
import { UserId } from '../utils/user-id.decorator';

interface UserUpdateResponse {
	title: string;
	message: string;
}

@UseGuards(JwtTwoFactorGuard)
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

	@Post('edit')
	async editUsername(@Body() newName: UpdateUsernameDto, @UserId() userId: number
	): Promise<UserUpdateResponse | null>
	{
		const resultUser = await this.usersService.updateUserName(userId, newName.newName);
		if (resultUser) {
			const response: UserUpdateResponse = {
				title: 'Username updated',
				message: `Username updated to ${resultUser.name}`
			};
			return response;
		}
		return null;
	}
}
