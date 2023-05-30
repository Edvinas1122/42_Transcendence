import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';


@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService,
				@Inject(UsersService) private readonly usersService: UsersService) {}

	async generateToken(payload: any): Promise<string> {
		return this.jwtService.sign(payload);
	  }

	async validateToken(token: string): Promise<any> {
		return this.jwtService.verify(token);
	}
}
