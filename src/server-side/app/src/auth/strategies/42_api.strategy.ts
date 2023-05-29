import { PassportStrategy } from '@nestjs/passport';

export class FourtyTwoStrategy extends PassportStrategy(Strategy, '42') {
	
}