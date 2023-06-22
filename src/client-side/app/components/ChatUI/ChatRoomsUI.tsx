import React from "react";
import fetchWithToken from "@/lib/fetch.util";
import { Chat } from "@/lib/DTO/AppData";
import UIListBox from "@/components/GeneralUI/GenericList";
import GenericForm from "@/components/GeneralUI/GenericForm";
import Link from "next/link";
import "./Chat.css";

const ChatRoomBox: Function = ({ item, style }: { item: Chat, style?: string }) => {
	return (
		<div className={"Entity " + style}>
			<Link href={`/chat/${item._id}`}>
				<p>
					<strong>{item.name}</strong>
					<span>{item.personal}</span>
				</p>
			</Link>
		</div>
	);
}

const CreateChatBox: Function = () => {
    return (
        <GenericForm 
            endpoint="/chat/create"
            method="POST"
            fields={[
                { name: 'name', value: '', type: 'text', optional: false, placeholder: 'Chat name...', displayName: 'Chat Name' },
                { name: 'isPrivate', value: false, type: 'checkbox', optional: true, displayName: 'Private' },
                { name: 'password', value: '', type: 'password', optional: true, placeholder: 'password... ' , displayName: 'Password' },
            ]}
        />
    );
}

const ChatRoomsUI: Function = async () => {

	const ChatsAvailable: Chat[] = await fetchWithToken<Chat[]>("/chat/available");

	return (
		<div className="Component">
			<h1>Available Chat Rooms</h1>
			<UIListBox Items={ChatsAvailable} BoxComponent={ChatRoomBox} ListStyle="AvailableChats" />
			<CreateChatBox />
		</div>
	);
};
  
export default ChatRoomsUI;