"use client";
import UIClientListBox, { UIClientListBoxClassBuilder, CategoryDisisplay } from "@/components/GeneralUI/GenericClientList";
import { EntityInterfaceBuilder } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";
import { AuthContext } from "@/components/ContextProviders/authContext";
import { ChatRoomSourceContext } from "@/components/ChatUI/ChatEventProvider";
import { Chat, GroupChat, isGroupChat, RoleType, User } from "@/lib/DTO/AppData";
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useCallback } from "react";
import "@/public/layout.css";
import "../Chat.css";
import DisplayPopUp from "@/components/EventsInfoUI/EventsInfo";

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
		return chat.participants.some((participant: User) => participant._id == id && participant?.Role !== RoleType.Invited);
	}
	return true;
}

// function doIleaveChat(router: any, PageId: number, chat: Chat, myId: number): boolean {
// 	console.log("do I leave chat", chat);
// 	if (isGroupChat(chat)) {
// 		if (!chat.participants.some((participant: User) => participant._id == myId)) {
// 			router.push("/chat");
// 			return true;
// 		}
// 	}
// 	console.log("I do not leave chat the chat");
// 	return false;
// }

const ChatRoomsLive: Function = ({ serverChats}: { serverChats: string }) => {

	const chatEvent = useContext(ChatRoomSourceContext);
	const id = useContext(AuthContext);
	const pathname = usePathname();
	const PageId = parseInt(pathname.split("/")[2]);
	const router = useRouter();

	const handleNewEvent = useCallback((setItems: Function) => {
		if (chatEvent) {
			// console.log("chat event", chatEvent.data);
			switch (chatEvent.subtype) {
				case "new-available":
					chatEvent.data.amParticipant = meParticipant(chatEvent.data, id.id);
					chatEvent.data.mine = chatEvent.data?.owner?._id == id.id ? true: false;
					console.log("new chat chat rooms live ", chatEvent.data);
					setItems((prevChats: Chat[]) => [...prevChats, chatEvent.data]);
					break;
				case "deleted":
					setItems((prevChats: Chat[]) => prevChats.filter((chat: Chat) => chat._id.toString() != chatEvent.roomID));
					console.log("deleted chat chat rooms live ", chatEvent.data._id, PageId);
					if (chatEvent.data._id.toString() == PageId) {
						router.replace("/chat");
					}
					break;
				case "kicked":
					console.log("someone is kicked", chatEvent.data);
					if (chatEvent.data.kickedId === id.id) { // fail to change state, I remove item
						setItems((prevChats: Chat[]) => prevChats.filter((currentChat: Chat) => currentChat._id !== chatEvent.data._id));
						const newChat = {
							name: chatEvent.data.name,
							_id: chatEvent.data._id,
							owner: chatEvent.data.owner,
							amParticipant: false,
							Participants: [],
							mine: false,
							personal: false,
						}
						if (!chatEvent.data.isPrivate) {
							setTimeout(() => {
								setItems((prevChats: Chat[]) => [...prevChats, newChat]);
							}, 3000);
						}
						router.replace("/chat");
						DisplayPopUp("You Kicked", "You are kicked from chat " + chatEvent.data.name, 3000, "warning");
					}
					break;
				case "banned":
					console.log("someone is banned", chatEvent.data);
					if (chatEvent.data.kickedId === id.id) {
						/// replace chat with new one
						console.log("I am banned!!");
						setItems((prevChats: Chat[]) => prevChats.filter((currentChat: Chat) => currentChat._id !== chatEvent.data._id));
						router.replace("/chat");
						DisplayPopUp("Ahh.. yayks!.", "You've been blocked from chat " + chatEvent.data.name, 3000, "warning");
					}
					break;
				case "unbanned":
					console.log("someone is unbanned", chatEvent.data);
					if (chatEvent.data.kickedId === id.id) {
						/// replace chat with new one
						console.log("I am unbanned!!");
						const newChat = {
							name: chatEvent.data.name,
							_id: chatEvent.data._id,
							owner: chatEvent.data.owner,
							amParticipant: false,
							Participants: [],
							mine: false,
							personal: false,
						}
						setItems((prevChats: Chat[]) => [...prevChats, newChat]);
					}
					break;
				case "invite":
					console.log("someone is invited", chatEvent.data);
					if (chatEvent.data.kickedId === id.id) {
						/// replace chat with new one
						console.log("I am invited!!");
						const newChat = {
							name: chatEvent.data.name,
							_id: chatEvent.data._id,
							owner: chatEvent.data.owner,
							amParticipant: false,
							Participants: [],
							mine: false,
							personal: false,
							isPrivate: true,
						}
						setItems((prevChats: Chat[]) => [...prevChats, newChat]);
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
				displayDependency: (item: Chat) => isGroupChat(item) && item?.mine && !item?.isPrivate ? true : false,
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
				// dependency: (item: Chat) => item?.amParticipant? true : false,
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
			dependency: (item: Chat): boolean => item.type === "personal"
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