"use client";
import UIClientListBox from "@/components/GeneralUI/GenericClientList";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { MessageSourceContext } from "@/components/ChatUI/ChatEventProvider";
import { Message } from "@/lib/DTO/AppData";
import DisplayPopUp from "@/components/EventsInfoUI/EventsInfo";
import { serverFetch } from "@/lib/fetch.util";

const MessageBox: Function = ({ item, style }: { item: Message, style?: string }) => {

	const messageClass = item.me ? 'Message user' : 'Message';
	const messageSpace = "MessageSpace";

	return (
		<div className="MessageArea">
			<div className={messageSpace}></div>
			<div className={messageClass}>
				{/* <p>{item.user.name}</p> */}
				<p>{item.content}</p>
			</div>
			<div className={messageSpace}></div>
		</div>
	);
}

const LiveMessages: Function = ({ initialMessages, chatID }: { initialMessages: Message[], chatID: number }) => {
	
	const newMessage: Message | null = useContext(MessageSourceContext);

    const handleNewMessage = useCallback((setItems: Function) => {
		console.log("LiveMessages Received ", chatID)
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
		/>
	);
}



export default LiveMessages;