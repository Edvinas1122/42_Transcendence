"use client";
import UIClientListBox, { UIClientListBoxClassBuilder, CategoryDisisplay } from "@/components/GeneralUI/GenericClientList";
import React, { useState, useEffect, useContext, useCallback, useRef, MouseEvent } from "react";
import { ChatRoomSourceContext } from "@/components/ChatUI/ChatEventProvider";
import Link from "next/link";
import { Chat, GroupChat, isGroupChat } from "@/lib/DTO/AppData";
import "../Chat.css";
import "@/public/layout.css";
import { serverFetch } from "@/lib/fetch.util";
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from "@/components/ContextProviders/authContext";
import { EntityInterfaceBuilder } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";

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

const amParticipant = (chat: GroupChat, tokenBearerID: number) => {
	if (isGroupChat(chat) && chat.owner._id == tokenBearerID.toString()) return true;
	return chat.participants.some((participant) => participant._id == tokenBearerID.toString());
}

const ChatRoomsLive: Function = ({ serverChats }: { serverChats: Chat[] }) => {

	const chatEvent = useContext(ChatRoomSourceContext);
	const id = useContext(AuthContext);
	const pathname = usePathname();
	const router = useRouter();

	const handleNewEvent = useCallback((setItems: Function) => {
		if (chatEvent) {
			// chatEvent.data.meParticipant = amParticipant(chatEvent.data, id);
			switch (chatEvent.subtype) {
				case "new-available":
					console.log("new chat", chatEvent.data);
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
					console.log("join chat chat rooms live ", chatEvent.data);
					// setItems((prevChats: Chat[]) => [...prevChats, chatEvent.data]);

					setItems((prevChats: Chat[]) => {
						return prevChats.map((chat: Chat) => {
							const data = chat._id.toString() === chatEvent.roomID
							? chatEvent.data : chat
							data.amParticipant = true;
							console.log("join chat chat rooms live ", data);
							return data;
						});
					});
					break;
				case "quit":
					console.log("quit chat chat rooms live ", chatEvent.data);
					break;
				default:
					break;
			}
		}
	}, [chatEvent, router]);

	const deleteChat = (item: Chat) => async (event: MouseEvent<HTMLButtonElement, MouseEvent>): Promise<boolean> => {
		event.preventDefault(); // Prevent the default button click behavior.
		await serverFetch(`/chat/${item._id}`, "DELETE");
		return true; // Or however you wish to determine success.
	}

	const joinChat = async (item: Chat): Promise<void> => {
		const response = await serverFetch(`/chat/roles/${item._id}/join`, "POST");
		console.log("join chat", response);
	}

	const quitChat = async (item: Chat): Promise<void> => {
		const response = await serverFetch(`/chat/roles/${item._id}/leave`, "POST");
		console.log("leave chat", response);
	}

	const isRouteActiveStyle = (item: Chat): string => {
		return item._id.toString() == pathname.split('/')[2] ? "Active" : "";
	}

	// const interfaceBuilder = new EntityInterfaceBuilder<Chat>()
		// .addRemoveButton("remove chat", deleteChat, (item: Chat) => item.mine ? true : false)
		// .addRemoveButton("dev remove chat", deleteChat) // delete this line
		// .addInteractButton("join chat", joinChat, (item: Chat): boolean => {
		// 	return isGroupChat(item) && !item.amParticipant && !item.mine ? true : false;
		// })
		// .addInteractButton("leave chat", quitChat, (item: Chat) => item.mine ? false : true)
		// .addConditionalStyle(isRouteActiveStyle)

	const interfaceBuilder = EntityInterfaceBuilder()
		.addInteractButton({
			name: "deleteChat",
			onClick: deleteChat,
		})
		.build();

	const ChatRoomList = new UIClientListBoxClassBuilder()
		.setInitialItems(serverChats)
		.setBoxComponent(ChatRoomBox)
		.setListStyle("AvailableChats")
		.setEntityInterface(interfaceBuilder)	
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