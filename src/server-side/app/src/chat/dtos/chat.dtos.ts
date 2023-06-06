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