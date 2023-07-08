import { Controller, Res, ClassSerializerInterceptor, UseInterceptors, UseGuards, Post, Body, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TwoFAService } from './twoFA.service';
import { Response } from 'express';
import { JwtAuthGuard }from '../guards/jwt.guard';
import { UserId } from '../../utils/user-id.decorator';
import { UsersService } from '../../users/users.service';
import { TwoFACodeDto } from './twoFA.dto';
import { TmpTokenStore } from '../tmpTokenStore.service';

interface TokenRetrieveReq {
    retrieve: string;
    code: string;
	id: number;
	server_secret: string;
}

@UseInterceptors(ClassSerializerInterceptor)
@Controller('2fa')
export class twoFAController {
	constructor(
		private readonly twoFAService: TwoFAService,
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
		@Inject(TmpTokenStore)
		private readonly tmpTokenStore: TmpTokenStore,
	){}

	@UseGuards(JwtAuthGuard)
	@Post('qr')
	async qrCode(
		@Res() response: Response,
		@UserId() userId: number
	) {
		const { otpAuthURL } = await this.twoFAService.generate2FASecret(userId);
		response.setHeader('content-type', 'image/png');
		const qrCode = await this.twoFAService.qrCodeStream(response, otpAuthURL);
		return  qrCode ;
	}

	@UseGuards(JwtAuthGuard)
	@Post('activate')
	async activate2FA(
		@UserId() currentUserId: number,
		@Body() twoFACodeDto: TwoFACodeDto
	): Promise<any>
	{
		const valid = await this.twoFAService.validate2FASecret(
			currentUserId,
			twoFACodeDto.code
		);
		if (!valid) {
			throw new UnauthorizedException('Invalid authentication code');
		}
		await this.usersService.activate2FA(currentUserId);
		return {
			error: false,
			status: "success",
			message: "2FA activated",
		};
	}

	@UseGuards(JwtAuthGuard)
	@Post('deactivate')
	async deactivate2FA(
		@Body() twoFACodeDto: TwoFACodeDto,
		@UserId() currentUserId: number
	): Promise<any>
	{
		const valid = await this.twoFAService.validate2FASecret(
			currentUserId,
			twoFACodeDto.code
		);
		if (!valid) {
			throw new UnauthorizedException('Invalid authentication code');
		}
		await this.usersService.deactivate2FA(currentUserId);
		return {
			error: false,
			status: "success",
			message: "2FA deactivated",
		};
	}
	
	// @UseGuards(JwtAuthGuard)
	// @Post('authenticate')
	// async authenticate2FA(
	// 	@UserId() currentUserId: number,
	// 	@Body() twoFACodeDto: TwoFACodeDto
	// ) {
	// 	const valid = await this.twoFAService.validate2FASecret(
	// 		currentUserId,
	// 		twoFACodeDto.code
	// 	);
	// 	if (!valid) {
	// 		throw new UnauthorizedException('Invalid authentication code');
	// 	}
	// 	const user = await this.usersService.getUser(currentUserId);
	// 	await this.usersService.validate2FA(currentUserId);
	// 	const accessToken = await this.authService.generateToken({id: user.id, owner: user.name});
	// 	return {accessToken};
	// }

	@Post('login')
	async authenticate2FAServer(
		@Body() retrieveReq: TokenRetrieveReq,
	) {
		const server_sercet = process.env.SERVER_SECRET;
		if (retrieveReq.server_secret !== server_sercet) {
			throw new UnauthorizedException('Unknown accessor');
		}
		const valid = await this.twoFAService.validate2FASecret(
			retrieveReq.id,
			retrieveReq.code
		);
		if (!valid) {
			throw new UnauthorizedException('Invalid 2FA code');
		}
		const accessToken = this.tmpTokenStore.retrieveTokenLink(retrieveReq.retrieve)
		if (!accessToken) {
			throw new UnauthorizedException('Invalid retrieve request token');
		}
		return {accessToken: accessToken};
	}
}