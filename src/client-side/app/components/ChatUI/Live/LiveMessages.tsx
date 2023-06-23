"use client";
import UIClientListBox from "@/components/GeneralUI/GenericClientList";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { EventSourceContext } from "@/components/ContextProviders/eventContext";
import { Message } from "@/lib/DTO/AppData";

const MessageBox: Function = ({ item, style }: { item: Message, style?: string }) => {

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

const LiveMessages: Function = ({ serverMessages, chatID }: { serverMessages: Message[], chatID: number }) => {
	
	const newMessage: Message | null = useContext(EventSourceContext);

    const handleNewMessage = useCallback((setItems: Function) => {
        if (newMessage && newMessage.chatID == chatID) {
            console.log("new message is mine", newMessage);
            setItems((prevMessages: Message[]) => [...prevMessages, newMessage]);
        }
    }, [newMessage, chatID]);

	// example
    const handleRemoveItem = useCallback((items: Message[], setItems: Function) => {
        setItems(items.slice(1));
    }, []);

	return (
		<UIClientListBox
			initialItems={serverMessages}
			setItemsCallback={handleNewMessage}
			BoxComponent={MessageBox}
			ListStyle="MessageList"
		/>
	);
}


export default LiveMessages;