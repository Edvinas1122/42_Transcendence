	import	{ Module } from '@nestjs/common';
	import	{ AuthService } from './auth.service';
	import	{ AuthController } from './auth.controller';
	import	{ UsersModule } from '../users/users.module';
	import	{ FourtyTwoStrategy } from './strategies/42.strategy';
	import	{ JwtStrategy } from './strategies/jwt.strategy';
	import	{ JwtModule } from '@nestjs/jwt';


	const JwtParams = {
		secret: 'your-secret-key', // Replace with your desired secret key
		signOptions: { expiresIn: '1d' }, // Optionally, set token expiration
	};

	@Module({
		controllers: [AuthController],
		imports: [UsersModule, JwtModule.register(JwtParams)],
		providers: [AuthService, FourtyTwoStrategy, JwtStrategy],
		exports: [AuthService],
	})

	export class AuthModule {}