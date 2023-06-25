import React from "react";
import fetchWithToken from "@/lib/fetch.util";
import { Chat } from "@/lib/DTO/AppData";
import UIListBox from "@/components/GeneralUI/GenericList";
import GenericForm from "@/components/GeneralUI/GenericForm";
import "./Chat.css";
import ChatRoomsLive from "./Live/ChatRooms.live";


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
			resetAfterSubmit = {true}
        />
    );
}

const ChatRoomsUI: Function = () => {

	return (
		<div className="Component">
			<h1>Available Chat Rooms</h1>
			<ChatRoomsLive serverChats={`/chat/available`} />
			<CreateChatBox />
		</div>
	);
};
  
export default ChatRoomsUI;