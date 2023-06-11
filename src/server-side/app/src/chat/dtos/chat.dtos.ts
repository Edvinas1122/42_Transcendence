export class CreateChatDto {
	name: string;
	ownerID: number;
	private: boolean;
	password: string;
	invitedUsersID?: number[];
	// mutedUsersID?: number[];
	// bannedUsersID?: number[];
	// add more fields as per your requirements
}

export class ChatIdDto {
	chatId: number;
}

export class UpdateChatDto extends CreateChatDto {
	id: number;
}

export class JoinChatDto {
	chatPassword: string;
}

export class SendMessagetDto {
	content: string;
	password: string | null;
}

export class DeleteMessageDto {
	messageId: number;
}

import { UserInfo } from '../../users/dtos/user.dto';
import { Message } from './message.dtos';
import { Chat } from '../entities/chat.entity';

export class ChatDto {
	constructor(chat: Chat, pesonal: boolean, messages?: Message[]) {
		this._id = chat.id;
		this.name = chat.name;
		// set a default empty array or set the messages directly if you have them at this point
		this.messages = messages || [];
	}

	_id: number;
	name: string;
	messages: Message[];
	personal: boolean;
}

export class PersonalChatDto extends ChatDto {
	constructor(chat: Chat, participant: UserInfo, messages?: Message[]) {
		super(chat, true, messages);
		this.participant = participant || null; // Assuming you can pass the participant during construction
	}
	participant: UserInfo;
}

export class GroupChatDto extends ChatDto {
	constructor(chat: Chat, owner: UserInfo, privileged: boolean, participants?: UserInfo[], messages?: Message[]) {
		super(chat, false, messages);
		this.owner = owner || null; // Assuming you can pass the owner during construction
		this.participants = participants || []; // Assuming you can pass the participants during construction
		this.privileged = privileged || false; // Assuming you can pass the privileged status during construction
	}
	owner: UserInfo;
	participants: UserInfo[];
	privileged: boolean;
	passwordProtected: boolean;
}
