interface CreateChatRequest {
	name: string;
	isPrivate: boolean;
	password?: string;
	invitedUsersID?: number[];
}

class SendMessageDto {
	constructor(message: string, password?: string) {
		this.content = message;
		this.password = password;
	}
	content: string;
	password?: string;
}

export type { CreateChatRequest, SendMessageDto };