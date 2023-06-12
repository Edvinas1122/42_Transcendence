import { UserInfo } from '../../users/dtos/user.dto';
import { Message } from '../entities/message.entity';

class MessageDto {
	constructor(message: Message) {
		this._id = message.id;
		this.content = message.content;
		this.user = new UserInfo(message.sender);
	}
	_id: number;
	content: string;
	user: UserInfo;
}

export { MessageDto };