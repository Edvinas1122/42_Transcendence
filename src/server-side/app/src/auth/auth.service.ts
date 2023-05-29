import { Injectable } from '@nestjs/common';
import { FourtyTwoStrategy } from './strategies/42.strategy';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService) {}

	async generateToken(payload: any): Promise<string> {
		return this.jwtService.sign(payload);
	  }

	async validateToken(token: string): Promise<any> {
		return this.jwtService.verify(token);
	}	
}