import	{ Module } from '@nestjs/common';
import	{ AuthService } from './auth.service';
import	{ AuthController } from './auth.controller';
import	{ UsersModule } from '../users/users.module';
import	{ FourtyTwoStrategy } from './strategies/42.strategy';
import	{ JwtStrategy, JwtParams } from './strategies/jwt.strategy';
import	{ JwtTwoFaStrategy} from './strategies/jwt-2fa.strategy';
import	{ JwtModule } from '@nestjs/jwt';
import	{ TmpTokenStore } from './tmpTokenStore.service';
import { TwoFAService } from './2FA/twoFA.service';
import { twoFAController } from './2FA/twoFA.controller';


@Module({
	controllers: [AuthController, twoFAController],
	imports: [UsersModule, JwtModule.register(JwtParams)],
	providers: [AuthService, FourtyTwoStrategy, JwtStrategy, JwtTwoFaStrategy, TmpTokenStore, TwoFAService],
	exports: [AuthService],
})

export class AuthModule {}