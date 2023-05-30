import	{ Module } from '@nestjs/common';
import	{ AuthService } from './auth.service';
import	{ AuthController } from './auth.controller';
import	{ UsersModule } from '../users/users.module';
import	{ FourtyTwoStrategy } from './strategies/42.strategy';
import	{ JwtStrategy, JwtParams } from './strategies/jwt.strategy';
import	{ JwtModule } from '@nestjs/jwt';
import { TmpTokenStore } from './tmpTokenStore.service';


	@Module({
		controllers: [AuthController],
		imports: [UsersModule, JwtModule.register(JwtParams)],
		providers: [AuthService, FourtyTwoStrategy, JwtStrategy, TmpTokenStore],
		exports: [AuthService],
	})

	export class AuthModule {}