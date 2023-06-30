"use client";
import UIClientListBox, { UIClientListBoxClassBuilder, CategoryDisisplay } from "@/components/GeneralUI/GenericClientList";
import React, { useState, useEffect, useContext, useCallback, useRef, MouseEvent } from "react";
import { ChatRoomSourceContext } from "@/components/ChatUI/ChatEventProvider";
import Link from "next/link";
import { Chat, GroupChat, isGroupChat, User } from "@/lib/DTO/AppData";
import "../Chat.css";
import "@/public/layout.css";
import { serverFetch } from "@/lib/fetch.util";
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from "@/components/ContextProviders/authContext";
import { EntityInterfaceBuilder } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";

interface ChatRoomBoxProps {
	item: Chat,
	childnode: React.ReactNode
}

const ChatRoomBox: React.FC<ChatRoomBoxProps> = ({
	item,
	childnode
}) => {

	return (
		<>
			<p>
				<strong>{item.name}</strong>
				<span>{item.personal}</span>
			</p>
			{childnode}
		</>
	);
}

const meParticipant = (chat: Chat, id: number): boolean => {
	if (isGroupChat(chat)) {
		console.log("me participant", chat.participants, id);
		return chat.participants.some((participant: User) => participant._id == id);
	}
	return true;
}

const ChatRoomsLive: Function = ({ serverChats }: { serverChats: Chat[] }) => {

	const chatEvent = useContext(ChatRoomSourceContext);
	const id = useContext(AuthContext);
	const pathname = usePathname();
	const router = useRouter();

	const handleNewEvent = useCallback((setItems: Function) => {
		if (chatEvent) {
			switch (chatEvent.subtype) {
				case "new-available":
					chatEvent.data.amParticipant = meParticipant(chatEvent.data, id.id);
					console.log("new chat chat rooms live ", chatEvent.data);
					setItems((prevChats: Chat[]) => [...prevChats, chatEvent.data]);
					break;
				case "deleted":
					setItems((prevChats: Chat[]) => prevChats.filter((chat: Chat) => chat._id.toString() != chatEvent.roomID));
					if (pathname.split('/')[2] == chatEvent.roomID.toString()) {
						router.push("/chat");
						console.log("Kick user from chat");
					}
					break;
				default:
					break;
			}
		}
	}, [chatEvent]);


	const ChatInterface = EntityInterfaceBuilder<Chat>()
		.addButton(
			{
				name: "Change Password",
				endpointTemplate: "/chat/[id]/password",
				type: "simple",
			}
		)
		.addToggleButton(
			{
				dependency: (item: Chat) => item?.amParticipant? true : false,
				type: "linkToggle",
				unitOne: {
					name: "Leave",
					endpointTemplate: "/chat/roles/[id]/leave",
					link: {link: "/chat", currentActiveOnly: "/chat/[@]"},
				},
				unitTwo: {
					name: "Join",
					endpointTemplate: "/chat/roles/[id]/join",
					// link: "/chat/[id]",
					fields: [
						{
							name: "password",
							type: "password",
							dependency: (item: Chat) => isGroupChat(item) && item?.protected? true : false,
						}
					]
				},
			}
		)
	
	const ChatRoomList = new UIClientListBoxClassBuilder()
		.setInitialItems(serverChats)
		.setBoxComponent(ChatRoomBox)
		.setEditItemsCallback(handleNewEvent)
		.setListStyle("AvailableChats")
		.setEntityInterface(ChatInterface)
		.addCategory({
			name: "Private Chats",
			dependency: (item: Chat): boolean => item.personal
		})
		.addCategory({
			name: "Group Chats",
			dependency: (item: Chat): boolean => !item.personal
		})
		.setLinkDefinition({
			linktemplate: "/chat/[id]",
			samePage: true,
			// highlightOnly: true,
			dependency: (item: Chat): boolean => item?.amParticipant? true : false
		})
		.build();

	return (
		<UIClientListBox
			{...ChatRoomList}
		/>
	);
}

export default ChatRoomsLive;