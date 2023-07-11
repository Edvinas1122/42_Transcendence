import { IsString, MinLength, MaxLength } from 'class-validator';
import { max } from 'rxjs';

export class InviteDto {

	@IsString()
	@MinLength(1)
	@MaxLength(20)
	username: string;
}