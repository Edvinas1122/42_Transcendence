"use client";
import UIClientListBox, { UIClientListBoxClassBuilder, CategoryDisisplay } from "@/components/GeneralUI/GenericClientList";
import { EntityInterfaceBuilder } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";
import { AuthContext } from "@/components/ContextProviders/authContext";
import { ChatRoomSourceContext } from "@/components/ChatUI/ChatEventProvider";
import { Chat, GroupChat, isGroupChat, User } from "@/lib/DTO/AppData";
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useCallback } from "react";
import "@/public/layout.css";
import "../Chat.css";

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

function doIleaveChat(router: any, pathname: string, chat: Chat, myId: number): boolean {
	if (isGroupChat(chat)) {
		if (!chat.participants.some((participant: User) => participant._id == myId)) {
			router.push("/chat");
			return true;
		}
	}
	return false;
}

const ChatRoomsLive: Function = ({ serverChats }: { serverChats: Chat[] }) => {

	const chatEvent = useContext(ChatRoomSourceContext);
	const id = useContext(AuthContext);
	const pathname = usePathname();
	const router = useRouter();

	const handleNewEvent = useCallback((setItems: Function) => {
		if (chatEvent) {
			console.log("chat event", chatEvent.data);
			switch (chatEvent.subtype) {
				case "new-available":
					chatEvent.data.amParticipant = meParticipant(chatEvent.data, id.id);
					chatEvent.data.mine = chatEvent.data.owner._id == id.id;
					console.log("new chat chat rooms live ", chatEvent.data);
					setItems((prevChats: Chat[]) => [...prevChats, chatEvent.data]);
					break;
				case "deleted":
					setItems((prevChats: Chat[]) => prevChats.filter((chat: Chat) => chat._id.toString() != chatEvent.roomID));
					doIleaveChat(router, pathname, chatEvent.data, id.id);
					break;
				case "kicked":
					console.log("kicked chat rooms live ", chatEvent.data);
					if (doIleaveChat(router, pathname, chatEvent.data, id.id)) {
						/// replace chat with new one
						console.log("I am kicked!!");
						setItems((prevChats: Chat[]) => prevChats.filter((currentChat: Chat) => currentChat._id !== chatEvent.data._id));
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
				endpointTemplate: "/chat/[id]/edit",
				type: "action",
				displayDependency: (item: Chat) => isGroupChat(item) && item?.mine? true : false,
				fields: [
					{
						name: "password",
						type: "password",
						dependency: (item: Chat) => true,
					}
				]
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
							dependency: (item: Chat) => isGroupChat(item) && item?.passwordProtected? true : false,
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
			name: "My Group Chats",
			dependency: (item: Chat): boolean => item.mine ? true : false
		})
		.addCategory({
			name: "Available Chats",
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