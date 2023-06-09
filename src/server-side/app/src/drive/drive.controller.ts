import { Controller, UseGuards, Req, Post, UploadedFile, UseInterceptors, Inject } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { stat, createReadStream } from 'fs';
import { Response } from 'express';
import { UsersService } from "../users/users.service";

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
		const fileName = `avatar-${userId}.png`;
		const path = join('/uploads', fileName);
		await writeFile(path, file.buffer);
		const avatar_url = process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL + "/avatar/" + fileName;
		await this.usersService.updateAvatar(userId, avatar_url);
		return { message: 'File uploaded successfully' };
	}
}
