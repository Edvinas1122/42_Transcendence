import { IsString, Length } from 'class-validator';
import { IsShortField, IsLongField } from '../../utils/formFields.decorator';

export class UserNameParam {
	@IsString()
	@Length(1, 20)
	user: string;
  }