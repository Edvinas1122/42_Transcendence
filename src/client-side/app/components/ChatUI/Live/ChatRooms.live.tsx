"use client";
import UIClientListBox, { EntityInterfaceBuilder } from "@/components/GeneralUI/GenericClientList";
import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { ChatRoomSourceContext } from "@/components/ChatUI/ChatEventProvider";
import Link from "next/link";
import { Chat } from "@/lib/DTO/AppData";
import "../Chat.css";
import { serverFetch } from "@/lib/fetch.util";
import { usePathname, useRouter } from 'next/navigation';

const ChatRoomBox: Function = ({ item, style }: { item: Chat, style?: string }) => {
	const router = useRouter();
	const openChatLink: Function = () => router.replace(`/chat/${item._id}`);

	return (
		<div className={style} onClick={openChatLink} style={{ cursor: 'pointer' }}>
				<p>
					<strong>{item.name}</strong>
					<span>{item.personal}</span>
				</p>
		</div>
	);
}

const ChatRoomsLive: Function = ({ serverChats }: { serverChats: Chat[] }) => {

	const chatEvent = useContext(ChatRoomSourceContext);
	const pathname = usePathname();
	const router = useRouter();

	const handleNewEvent = useCallback((setItems: Function) => {
		if (chatEvent) {
			console.log("new chat is mine", chatEvent);
			switch (chatEvent.subtype) {
				case "new-available":
					setItems((prevChats: Chat[]) => [...prevChats, chatEvent.data]);
					break;
				case "deleted":
					setItems((prevChats: Chat[]) => prevChats.filter((chat: Chat) => chat._id.toString() != chatEvent.roomID));
					if (pathname.split('/')[2] == chatEvent.roomID.toString()) {
						router.push("/chat");
						console.log("Kick user from chat");
					}
					break;
				case "join":
					break;
				case "quit":
					break;
				default:
					break;
			}
		}
	}, [chatEvent]);

	const canDeleteChat = (item: Chat): boolean => {
		console.log("can delete chat", item);
		if (item.personal)
			return true;
		else
			return item.mine? true : false;
	}

	const deleteChat = (item: Chat): void => {
		serverFetch(`/chat/${item._id}`, "DELETE");
	}

	const joinChat = (item: Chat): void => {
		serverFetch(`/chat/roles/${item._id}/join`, "POST");
	}

	const ChatRoomInterface = new EntityInterfaceBuilder()
		.addRemoveButton("remove chat", deleteChat)
		.addInteractButton("join chat", joinChat, (item: Chat) => !item.mine)
		.addInteractButton("quit chat", () => console.log("quit chat"), (item: Chat) => item.mine ? true : false)
		.build();

	return (
		<UIClientListBox
			initialItems={serverChats}
			BoxComponent={ChatRoomBox}
			ListStyle="AvailableChats"
			entityInterface={ChatRoomInterface}
			editItemsCallback={handleNewEvent}
		/>
	);
}

export default ChatRoomsLive;