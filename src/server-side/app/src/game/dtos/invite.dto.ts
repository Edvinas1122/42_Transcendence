import { IsString, MinLength, MaxLength } from 'class-validator';
import { IsShortField } from '../../utils/formFields.decorator';
import { max } from 'rxjs';

export class InviteDto {

	@IsString()
	@IsShortField()
	username: string;
}