"use client";
import UIClientListBox, { EntityInterfaceBuilder, UIClientListBoxClassBuilder, CategoryDisisplay } from "@/components/GeneralUI/GenericClientList";
import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { ChatRoomSourceContext } from "@/components/ChatUI/ChatEventProvider";
import Link from "next/link";
import { Chat, isGroupChat } from "@/lib/DTO/AppData";
import "../Chat.css";
import "@/public/layout.css";
import { serverFetch } from "@/lib/fetch.util";
import { usePathname, useRouter } from 'next/navigation';

const ChatRoomBox: Function = ({ item, style }: { item: Chat, style?: string }) => {
	const pathname = usePathname();
	const router = useRouter();
	const openChatLink = () => router.replace(`/chat/${item._id}`);

	return (
		<div onClick={openChatLink} style={{ cursor: 'pointer' }}>
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
	}, [chatEvent, router]);

	const deleteChat = (item: Chat): void => {
		serverFetch(`/chat/${item._id}`, "DELETE");
	}

	const joinChat = async (item: Chat): Promise<void> => {
		const response = await serverFetch(`/chat/roles/${item._id}/join`, "POST");
		console.log("join chat", response);
	}

	const isRouteActiveStyle = (item: Chat): string => {
		return item._id.toString() == pathname.split('/')[2] ? "Active" : "";
	}

	const ChatRoomInterface = new EntityInterfaceBuilder()
		.addRemoveButton("remove chat", deleteChat, (item: Chat) => item.mine ? true : false)
		.addRemoveButton("dev remove chat", deleteChat) // delete this line
		.addInteractButton("join chat", joinChat, (item: Chat): boolean => {
			console.log("join chat", item);
			console.log("participant", item.amParticipant);
			console.log("mine", item.mine);
			console.log("is group chat", isGroupChat(item));
			console.log("output", isGroupChat(item) && !item.amParticipant ? true : false);
			return isGroupChat(item) && !item.amParticipant && !item.mine ? true : false;
		})
		.addInteractButton("quit chat", () => console.log("quit chat"), (item: Chat) => item.mine ? false : true)
		.addConditionalStyle(isRouteActiveStyle)
		.build();

	const ChatRoomList = new UIClientListBoxClassBuilder()
		.setInitialItems(serverChats)
		.setBoxComponent(ChatRoomBox)
		.setListStyle("AvailableChats")
		.setEntityInterface(ChatRoomInterface)
		.setEditItemsCallback(handleNewEvent)
		.addCategory({
			name: "Private Chats",
			dependency: (item: Chat): boolean => item.personal
		})
		.addCategory({
			name: "Group Chats",
			dependency: (item: Chat): boolean => !item.personal
		})
		.build();


	return (
		<UIClientListBox
			{...ChatRoomList}
		/>
	);
}

export default ChatRoomsLive;