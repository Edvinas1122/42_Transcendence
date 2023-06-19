"use client";

import { Message } from "@/lib/DTO/AppData";
import { SendMessageDto } from "@/lib/DTO/PostData";
import React, { useState, useContext } from "react";
import { AuthorizedFetchContext } from "../ContextProviders/authContext";

const MessagePostController = ({chatId, password}: {chatId: string, password?: string}) => {

	const {fetchWithToken} = useContext(AuthorizedFetchContext);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);

	const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const messageDto: SendMessageDto = {
			content: message,
			password: password,
		};
		const response = await fetchWithToken(`/chat/messages/${chatId}`, {
			method: "POST",
			body: JSON.stringify(messageDto),
		});
		const data = await response.json();
		console.log(data);
	}

	return (
		<div>
			<form onSubmit={sendMessage}>
				<input type="text" value={message} onChange={e => setMessage(e.target.value)} />
				<input type="submit" value="Send" />
			</form>
		</div>
	);
}

export default MessagePostController;