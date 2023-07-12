import { Controller, UseGuards, Req, Post, UploadedFile, UseInterceptors, Inject } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { Express } from 'express';
import { UsersService } from "../users/users.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { UserId } from "../utils/user-id.decorator";

@UseGuards(JwtAuthGuard)
@Controller('drive')
export class DriveController {
	constructor(
		@Inject(UsersService)
		private readonly usersService: UsersService,
	) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadAvatar(
		@UserId() userId,
		@UploadedFile() file: Express.Multer.File
	) {
		console.log(file.buffer);
		const fileName = `avatar-${userId}.jpg`;
		const path = join('/uploads/', fileName);
		const completed = await writeFile(path, file.buffer);
		console.log(completed);
		const avatar_url = process.env.FRONT_END_API + "/avatar/" + fileName;
		await this.usersService.updateAvatar(userId, avatar_url);
		console.log(file.buffer);
		return { message: 'File uploaded successfully' };
	}
}
