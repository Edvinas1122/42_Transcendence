interface CreateChatRequest {
	name: string;
	private: boolean;
	password: string;
	invitedUsersID?: number[];
}

interface SendMessage {
	content: string;
	password?: string;
}

export { CreateChatRequest, SendMessage };