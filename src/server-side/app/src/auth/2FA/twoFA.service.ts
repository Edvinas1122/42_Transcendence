import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { authenticator } from 'otplib';
import { User } from "../../users/entities/user.entity";
import { UsersService } from "../../users/users.service";
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { Inject } from '@nestjs/common';

@Injectable()
export class TwoFAService {
    constructor (
        @Inject(UsersService)
        private authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    public async generate2FASecret(id: number
) {
        const user = await this.usersService.getUser(id);
        if (!user) {
            console.log("no")
        }
        const secret = authenticator.generateSecret();
        const otpAuthURL = authenticator.keyuri(
            user.name,
            process.env.TWO_FA_NAME,
            secret
        );
        await this.usersService.set2FASecret(secret, id);
        return {
            secret, 
            otpAuthURL
        }
    }

    public async qrCodeStream(stream: Response, otpAuthURL: string) {
        return await toFileStream(stream, otpAuthURL);
    }

    public async validate2FASecret(id: number, twoFAcode: string): Promise<boolean> {
        const user = await this.usersService.getUser(id);
        if (!user) {
            return false;
        }
        let valid : boolean;
        try {
            valid = authenticator.verify({
                token: twoFAcode,
                secret: user.twoFactorAuthSecret
            })
            return valid;
        } catch (error) {
            console.log("Validation Error : ", error);
            return false;
        }
    }
}