import { UserInfo } from '../../users/dtos/user.dto';


export class Message {
	_id: string;
	content: string;
	user: UserInfo;
}