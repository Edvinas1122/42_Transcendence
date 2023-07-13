import { Controller, UseGuards, Req, Post, UploadedFile, UseInterceptors, Inject } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { Express } from 'express';
import { UsersService } from "../users/users.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

@UseGuards(JwtAuthGuard)
@Controller('drive')
export class DriveController {
	constructor(
		@Inject(UsersService)
		private readonly usersService: UsersService,
	) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
		const userId = req['user']['id'];
		console.log(file.buffer);
		const fileName = `avatar-${userId}-${new Date()}.jpg`;
		const path = join('/uploads/', fileName);
		await writeFile(path, file.buffer);
		const avatar_url = process.env.FRONT_END_API + "/avatar/" + fileName;
		await this.usersService.updateAvatar(userId, avatar_url);
		return { message: 'File uploaded successfully' };
	}
}
