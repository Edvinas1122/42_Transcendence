import { UserInfo } from '../../users/dtos/user.dto';
import { Message } from '../entities/message.entity';
import { User } from '../../users/entities/user.entity';

class MessageDto {
	constructor(message: Message, userId?: number, user?: User) {
		this._id = message.id;
		this.content = message.content;
		if (user) {
			this.user = new UserInfo(user);
		}
		if (userId == message.senderID) {
			this.me = true;
		}
	}
	_id: number;
	content: string;
	user?: UserInfo;
	me?: boolean;
}

export { MessageDto };