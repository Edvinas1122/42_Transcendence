import { Controller, Res, ClassSerializerInterceptor, UseInterceptors, UseGuards, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TwoFAService } from './twoFA.service';
import { Response } from 'express';
import { JwtAuthGuard }from '../guards/jwt.guard';
import { UserId } from '../../utils/user-id.decorator';
import { UsersService } from '../../users/users.service';
import { TwoFACodeDto } from './twoFA.dto';


@UseInterceptors(ClassSerializerInterceptor)
@Controller('2fa')
export class twoFAController {
    constructor(
        private readonly twoFAService: TwoFAService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
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
}