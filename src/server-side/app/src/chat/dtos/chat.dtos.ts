export class CreateChatDto {
	name: string;
	ownerID: number;
	private: boolean;
	password: string;
	participantsID: number[];
	// mutedUsersID: number[];
	// bannedUsersID: number[];
	invitedUsersID?: number[];
	// add more fields as per your requirements
}

export class ChatIdDto {
	chatId: number;
}

export class UpdateChatDto extends CreateChatDto {
	id: number;
}

export class UserChatActionDto {
	chatId: number;
	userId: number;
}

export class SendMessageDto {
	content: string;
	receiverId: number;
}

export class SendMessageToChatDto {
	content: string;
	chatId: number;
	password: string;
}

export class DeleteMessageDto {
	messageId: number;
}

import { UserInfo } from '../../users/dtos/user.dto';
import { Message } from './message.dtos';

export class Chat {
	_id: string;
	name: string;
	messages: Message[];
}

export class PersonalChat extends Chat {
	participant: UserInfo;
}

export class GroupChatDto extends Chat {
	owner: UserInfo;
	participants: UserInfo[];
	privileged: boolean;
}
