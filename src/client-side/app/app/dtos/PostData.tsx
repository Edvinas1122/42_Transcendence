interface CreateChatRequest {
	name: string;
	private: boolean;
	password?: string;
	invitedUsersID?: number[];
}

class SendMessageDto {
	constructor(message: string, password?: string) {
		this.content = message;
	}
	content: string;
	password?: string;
}

export type { CreateChatRequest, SendMessageDto };