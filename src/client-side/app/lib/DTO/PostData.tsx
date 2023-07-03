interface CreateChatRequest {
	name: string;
	isPrivate: boolean;
	password?: string;
	invitedUsersID?: number[];
}

class SendMessageDto {
	constructor(message: string) {
		this.content = message;
	}
	content: string;
}

export type { CreateChatRequest, SendMessageDto };