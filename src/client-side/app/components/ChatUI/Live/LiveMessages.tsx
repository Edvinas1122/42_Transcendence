"use client";
import UIClientListBox from "@/components/GeneralUI/GenericClientList";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { MessageSourceContext } from "@/components/ChatUI/ChatEventProvider";
import { Message } from "@/lib/DTO/AppData";
import DisplayPopUp from "@/components/EventsInfoUI/EventsInfo";
import { serverFetch } from "@/lib/fetch.util";
import "@/components/ChatUI/Chat.css";


const MessageBox: Function = ({ item }: { item: Message }) => {

	const messageClass = item.me ? 'Message user' : 'Message';
	const messageSpace = "MessageSpace";

	return (
		<>
			<div className={messageSpace}></div>
			<div className={messageClass}>
				<article>
					<header>
						<address>{item.user.name}</address>
						{/* <time>{item.timeSent}</time> */}
					</header>
					<p>{item.content}</p>
				</article>
			</div>
			<div className={messageSpace}></div>
		</>
	);
}

// set async to re-render on every new message
const LiveMessages: Function = ({ initialMessages, chatID }: { initialMessages: Message[] | string, chatID: number }) => {
	
	const newMessage: Message | null = useContext(MessageSourceContext);

	const handleNewMessage = useCallback((setItems: Function) => {
		if (newMessage && newMessage.chatID == chatID) {
			setItems((prevMessages: Message[]) => [...prevMessages, newMessage]);
		}
	}, [newMessage, chatID]);

	return (
		<UIClientListBox
			initialItems={initialMessages}
			editItemsCallback={handleNewMessage}
			BoxComponent={MessageBox}
			ListStyle="MessageList"
			BoxStyle="MessageArea"
		/>
	);
}



export default LiveMessages;