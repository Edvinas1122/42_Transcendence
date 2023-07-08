import { Controller, Res, ClassSerializerInterceptor, UseInterceptors, UseGuards, Post, Body, UnauthorizedException, Inject } from '@nestjs/common';
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
	async qrCode(@Res() response: Response, @UserId() userId: number) {
		const { otpAuthURL } = await this.twoFAService.generate2FASecret(userId);
		response.setHeader('content-type', 'image/png');
		const qrCode = await this.twoFAService.qrCodeStream(response, otpAuthURL);
		return  qrCode ;
	}

	@UseGuards(JwtAuthGuard)
	@Post('activate')
	async activate2FA(@UserId() currentUserId: number, @Body() twoFACodeDto: TwoFACodeDto) {
		const valid = await this.twoFAService.validate2FASecret(
			currentUserId,
			twoFACodeDto.code
		);
		if (!valid) {
			throw new UnauthorizedException('Invalid authentication code');
		}
		await this.usersService.activate2FA(currentUserId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('deactivate')
	async deactivate2FA(@Body() twoFACodeDto: TwoFACodeDto, @UserId() currentUserId: number) {
		const valid = await this.twoFAService.validate2FASecret(
			currentUserId,
			twoFACodeDto.code
		);
		if (!valid) {
			throw new UnauthorizedException('Invalid authentication code');
		}
		await this.usersService.deactivate2FA(currentUserId);
	}
	
	@UseGuards(JwtAuthGuard)
	@Post('authenticate')
	async authenticate2FA(@UserId() currentUserId: number, @Body() twoFACodeDto: TwoFACodeDto) {
		const valid = await this.twoFAService.validate2FASecret(
			currentUserId,
			twoFACodeDto.code
		);
		if (!valid) {
			throw new UnauthorizedException('Invalid authentication code');
		}
		const user = await this.usersService.getUser(currentUserId);
		await this.usersService.validate2FA(currentUserId);
		const accessToken = await this.authService.generateToken({id: user.id, owner: user.name});
		return {accessToken};
	}

	@Post('login')
	async authenticate2FAServer(
		@Body() retrieveReq: TokenRetrieveReq,
	) {
		const valid = await this.twoFAService.validate2FASecret(
			retrieveReq.id,
			retrieveReq.code
		);
		if (!valid) {
			throw new UnauthorizedException('Invalid authentication code');
		}
		const user = await this.usersService.validate2FA(retrieveReq.id);
		if (!user) {
			throw new UnauthorizedException('Invalid request');
		}
		const accessToken = this.tmpTokenStore.retrieveTokenLink(retrieveReq.retrieve)
		console.log("passed token: ", accessToken);
		if (!accessToken) {
			throw new UnauthorizedException('Invalid request');
		}
		return {accessToken: accessToken};
	}
}