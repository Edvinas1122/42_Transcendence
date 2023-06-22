"use client";
import UIClientListBox from "@/components/GeneralUI/GenericClientList";
import React, { useState, useEffect, useContext } from "react";
import { EventSourceContext } from "@/components/ContextProviders/eventContext";
import { Message } from "@/lib/DTO/AppData";

const MessageBox: React.FC = ({ item, style }: { item: Message, style?: string }) => {

	const messageClass = item.me ? 'Message user' : 'Message';
	const messageSpace = "MessageSpace";

	return (
		<div className="MessageArea">
			<div className={messageSpace}></div>
			<div className={messageClass}>
				<p>{item.content}</p>
			</div>
			<div className={messageSpace}></div>
		</div>
	);
}

const LiveMessages: React.FC = ({ serverMessages, chatID }: { serverMessages: Message[], chatID: number }) => {
	
	const newMessage: Message | null = useContext(EventSourceContext);
	const [Messages, setMessages] = useState<Message[]>(serverMessages);

	useEffect(() => {
		if (newMessage && newMessage.chatID == chatID) {
			console.log("new message is mine", newMessage);
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		}
	}, [newMessage]);

	return (
		<UIClientListBox Items={Messages} BoxComponent={MessageBox} ListStyle="MessageList" />
	);
}


export default LiveMessages;